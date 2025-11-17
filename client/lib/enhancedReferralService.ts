import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { getBenefitForReferral, addMonths } from "./referralRulesService";
import type {
  User,
  Referral,
  ReferralReward,
  ReferralStats
} from "@/types/referral";

/**
 * Activate referral and apply benefits (called from webhook)
 */
export async function activateReferralAndApplyBenefits(data: {
  referrerUserId: string;
  referrerRole: 'alumno' | 'academia';
  referralCode: string;
  buyerUserId: string;
  buyerEmail: string;
  buyerRole: 'alumno' | 'academia';
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}): Promise<void> {
  try {
    console.log('🎯 Activating referral and applying benefits:', data);

    // Get the appropriate benefit rule
    const benefitRule = await getBenefitForReferral(data.referrerRole, data.buyerRole);

    if (!benefitRule) {
      console.log('❌ No benefit rule found for this referral combination');
      return;
    }

    console.log('✅ Found benefit rule:', benefitRule);

    await runTransaction(db, async (transaction) => {
      const now = Date.now();

      // 1. Create or update referral record
      const referralData: Omit<Referral, 'id'> = {
        referrerUserId: data.referrerUserId,
        referrerRole: data.referrerRole,
        referralCode: data.referralCode,
        buyerUserId: data.buyerUserId,
        buyerEmail: data.buyerEmail,
        buyerRole: data.buyerRole,
        amount: data.amount,
        currency: data.currency,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        status: 'approved',
        activated: true,
        activatedAtMs: now,
        benefitReferrer: benefitRule.referrerBenefit,
        benefitReferred: benefitRule.referredBenefit,
        createdAt: serverTimestamp(),
        createdAtMs: now,
      };

      const referralRef = doc(collection(db, 'referrals'));
      transaction.set(referralRef, referralData);

      // 2. Get current user data to calculate new entitlement period
      const userRef = doc(db, 'users', data.referrerUserId);
      const userSnap = await transaction.get(userRef);

      let currentEntitlementEnd = now;
      if (userSnap.exists()) {
        const userData = userSnap.data();
        currentEntitlementEnd = Math.max(
          now,
          userData.entitlementEndAtMs || now
        );
      }

      // 3. Calculate new entitlement period
      const startDate = new Date(currentEntitlementEnd);
      const endDate = addMonths(startDate, benefitRule.referrerBenefit.months);
      const newEntitlementEnd = endDate.getTime();

      // 4. Update user's entitlement
      const currentCount = userSnap.exists() ? (userSnap.data().referralsCount || 0) : 0;
      const currentRevenue = userSnap.exists() ? (userSnap.data().referralsRevenue || 0) : 0;

      transaction.update(userRef, {
        referralsCount: currentCount + 1,
        referralsRevenue: currentRevenue + data.amount,
        entitlementEndAtMs: newEntitlementEnd,
      });

      // 5. Create reward record
      const rewardData: Omit<ReferralReward, 'id'> = {
        userId: data.referrerUserId,
        sourceReferralId: referralRef.id,
        type: benefitRule.referrerBenefit.type as 'months_free' | 'year_free',
        months: benefitRule.referrerBenefit.months,
        appliedAtMs: now,
        startsAtMs: currentEntitlementEnd,
        endsAtMs: newEntitlementEnd,
        status: 'granted',
        note: `Benefit from referral: ${data.buyerEmail}`,
      };

      const rewardRef = doc(collection(db, 'referral_rewards'));
      transaction.set(rewardRef, rewardData);

      console.log('✅ Referral activated and benefits applied successfully');
    });

  } catch (error) {
    console.error('❌ Error activating referral and applying benefits:', error);
    throw error;
  }
}

/**
 * Get user's referral statistics
 */
export async function getUserReferralStats(userId: string): Promise<ReferralStats> {
  try {
    // Get user data for current entitlement
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    let currentEntitlementEnd: number | undefined;
    let daysRemaining: number | undefined;

    if (userSnap.exists()) {
      const userData = userSnap.data();
      currentEntitlementEnd = userData.entitlementEndAtMs;

      if (currentEntitlementEnd && currentEntitlementEnd > Date.now()) {
        daysRemaining = Math.ceil((currentEntitlementEnd - Date.now()) / (1000 * 60 * 60 * 24));
      }
    }

    // Get activated referrals count
    const activatedReferralsQuery = query(
      collection(db, 'referrals'),
      where('referrerUserId', '==', userId),
      where('activated', '==', true)
    );

    const activatedReferralsSnap = await getDocs(activatedReferralsQuery);
    const totalActivated = activatedReferralsSnap.size;

    // Get total benefit months from rewards
    const rewardsQuery = query(
      collection(db, 'referral_rewards'),
      where('userId', '==', userId),
      where('status', '==', 'granted')
    );

    const rewardsSnap = await getDocs(rewardsQuery);
    const totalBenefitMonths = rewardsSnap.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.months || 0);
    }, 0);

    return {
      totalActivated,
      totalBenefitMonths,
      currentEntitlementEnd,
      daysRemaining,
    };
  } catch (error) {
    console.error('Error getting user referral stats:', error);
    return {
      totalActivated: 0,
      totalBenefitMonths: 0,
    };
  }
}

/**
 * Get user's referral history with rewards info
 */
export async function getUserReferralsWithRewards(userId: string): Promise<(Referral & { reward?: ReferralReward })[]> {
  try {
    let referrals: Referral[] = [];

    try {
      // Try the optimal query with index
      const referralsQuery = query(
        collection(db, 'referrals'),
        where('referrerUserId', '==', userId),
        orderBy('createdAtMs', 'desc'),
        limit(50)
      );

      const referralsSnap = await getDocs(referralsQuery);
      referrals = referralsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Referral));

    } catch (indexError: any) {
      if (indexError.code === 'failed-precondition' && indexError.message.includes('index')) {
        console.warn('🚨 Index not ready, using fallback query for referrals...');

        // Fallback: Get all user referrals without ordering, then sort in memory
        const fallbackQuery = query(
          collection(db, 'referrals'),
          where('referrerUserId', '==', userId),
          limit(50)
        );

        const fallbackSnap = await getDocs(fallbackQuery);
        referrals = fallbackSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Referral))
          .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

        console.log(`✅ Fallback successful: loaded ${referrals.length} referrals`);
      } else {
        throw indexError; // Re-throw non-index errors
      }
    }

    // Get associated rewards
    const rewards = new Map<string, ReferralReward>();

    if (referrals.length > 0) {
      const rewardsQuery = query(
        collection(db, 'referral_rewards'),
        where('userId', '==', userId),
        where('status', '==', 'granted')
      );

      const rewardsSnap = await getDocs(rewardsQuery);
      rewardsSnap.docs.forEach(doc => {
        const reward = { id: doc.id, ...doc.data() } as ReferralReward;
        rewards.set(reward.sourceReferralId, reward);
      });
    }

    // Combine referrals with their rewards
    return referrals.map(referral => ({
      ...referral,
      reward: referral.id ? rewards.get(referral.id) : undefined,
    }));

  } catch (error) {
    console.error('Error getting user referrals with rewards:', error);
    return [];
  }
}

/**
 * Subscribe to user's referral stats (real-time)
 */
export function subscribeToUserReferralStats(
  userId: string,
  callback: (stats: ReferralStats) => void
): Unsubscribe {
  // Subscribe to user document for entitlement changes
  const userRef = doc(db, 'users', userId);

  return onSnapshot(userRef, async (userSnap) => {
    try {
      const stats = await getUserReferralStats(userId);
      callback(stats);
    } catch (error) {
      console.error('Error in referral stats subscription:', error);
    }
  });
}

/**
 * Subscribe to user's referrals (real-time)
 */
export function subscribeToUserReferrals(
  userId: string,
  callback: (referrals: (Referral & { reward?: ReferralReward })[]) => void,
  onIndexError?: () => void
): Unsubscribe {
  // First try the optimized query with composite index
  try {
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerUserId', '==', userId),
      orderBy('createdAtMs', 'desc'),
      limit(50)
    );

    return onSnapshot(referralsQuery, async (snapshot) => {
      try {
        const referrals = await getUserReferralsWithRewards(userId);
        callback(referrals);
      } catch (error) {
        console.error('Error in referrals subscription:', error);
        callback([]); // Return empty array for errors
      }
    }, (error) => {
      console.error('Snapshot listener error:', error);
      handleIndexError(error, userId, callback, onIndexError);
    });

  } catch (setupError: any) {
    // If the query setup itself fails (index not ready), use fallback immediately
    console.warn('Composite index not ready, using fallback subscription:', setupError);
    return subscribeToUserReferralsFallback(userId, callback, onIndexError);
  }
}

/**
 * Fallback subscription that doesn't require composite index
 */
function subscribeToUserReferralsFallback(
  userId: string,
  callback: (referrals: (Referral & { reward?: ReferralReward })[]) => void,
  onIndexError?: () => void
): Unsubscribe {
  console.log('📡 Using fallback subscription for referrals (no composite index)');

  // Use basic query without orderBy (no index required)
  const basicQuery = query(
    collection(db, 'referrals'),
    where('referrerUserId', '==', userId),
    limit(50)
  );

  return onSnapshot(basicQuery, async (snapshot) => {
    try {
      // Get referrals and sort in memory
      const basicReferrals = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Referral))
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      // Get rewards separately
      const rewardsQuery = query(
        collection(db, 'referral_rewards'),
        where('userId', '==', userId),
        where('status', '==', 'granted')
      );

      const rewardsSnap = await getDocs(rewardsQuery);
      const rewards = new Map<string, ReferralReward>();

      rewardsSnap.docs.forEach(doc => {
        const reward = { id: doc.id, ...doc.data() } as ReferralReward;
        rewards.set(reward.sourceReferralId, reward);
      });

      const referralsWithRewards = basicReferrals.map(referral => ({
        ...referral,
        reward: referral.id ? rewards.get(referral.id) : undefined,
      }));

      callback(referralsWithRewards);
    } catch (error) {
      console.error('Error in fallback referrals subscription:', error);
      callback([]);
    }
  }, (error) => {
    console.error('Fallback snapshot listener error:', error);
    handleIndexError(error, userId, callback, onIndexError);
  });
}

/**
 * Handle index errors consistently
 */
function handleIndexError(
  error: any,
  userId: string,
  callback: (referrals: (Referral & { reward?: ReferralReward })[]) => void,
  onIndexError?: () => void
) {
  if (error.code === 'failed-precondition' && error.message.includes('index')) {
    console.error(`
🚨 FIRESTORE INDEX REQUIRED 🚨

The referrals system requires a composite index to work properly.

QUICK FIX: Click this link to create the index:
https://console.firebase.google.com/v1/r/project/cursor-64188/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9jdXJzb3ItNjQxODgvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3JlZmVycmFscy9pbmRleGVzL18QARoSCg5yZWZlcnJlclVzZXJJZBABGg8KC2NyZWF0ZWRBdE1zEAIaDAoIX19uYW1lX18QAg

Manual steps:
1. Go to Firebase Console → Firestore → Indexes
2. Create composite index for collection: 'referrals'
3. Fields: referrerUserId (Ascending), createdAtMs (Descending)

Index creation takes 1-5 minutes for small datasets.
    `);

    // Trigger index error UI if callback provided
    if (onIndexError) {
      onIndexError();
    }
  }

  // Always return empty array on error
  callback([]);
}

/**
 * Check if referral already exists (idempotency)
 */
export async function referralExists(stripeSessionId: string): Promise<boolean> {
  const existingQuery = query(
    collection(db, 'referrals'),
    where('stripeSessionId', '==', stripeSessionId)
  );

  const existingSnap = await getDocs(existingQuery);
  return !existingSnap.empty;
}
