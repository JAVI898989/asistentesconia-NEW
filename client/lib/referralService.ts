import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
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
import type { User, ReferralCode, Referral, ReferralValidationResult, ReferralMetrics } from "@/types/referral";

/**
 * Generate a unique referral code
 */
export function makeReferralCode(role: 'alumno' | 'academia'): string {
  const prefix = role === 'academia' ? 'ACA' : 'ALU';
  const body = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${body}`;
}

/**
 * Create a referral code for a user (with transaction for uniqueness)
 */
export async function createReferralCodeForUser(
  userId: string, 
  userEmail: string, 
  role: 'alumno' | 'academia'
): Promise<string> {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = makeReferralCode(role);
    
    try {
      await runTransaction(db, async (transaction) => {
        // Check if code already exists
        const codeRef = doc(db, 'referral_codes', code);
        const codeSnap = await transaction.get(codeRef);
        
        if (codeSnap.exists()) {
          throw new Error('Code already exists');
        }
        
        // Create the referral code document
        const codeData: ReferralCode = {
          code,
          ownerUserId: userId,
          ownerRole: role,
          createdAt: serverTimestamp(),
          createdAtMs: Date.now(),
          status: 'active',
        };
        transaction.set(codeRef, codeData);
        
        // Update user document with referral code
        const userRef = doc(db, 'users', userId);
        transaction.update(userRef, {
          referralCode: code,
          referralsCount: 0,
          referralsRevenue: 0,
        });
      });
      
      return code;
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw new Error('Failed to generate unique referral code after maximum attempts');
      }
      // Continue to next attempt
    }
  }
  
  throw new Error('Failed to generate referral code');
}

/**
 * Get or create referral code for a user
 */
export async function ensureUserHasReferralCode(
  userId: string, 
  userEmail: string, 
  role: 'alumno' | 'academia'
): Promise<string> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (userData.referralCode) {
      return userData.referralCode;
    }
  }
  
  // Create referral code
  return await createReferralCodeForUser(userId, userEmail, role);
}

/**
 * Validate and resolve a referral code
 */
export async function resolveReferralCode(
  code: string, 
  buyerUserId?: string
): Promise<ReferralValidationResult> {
  if (!code) {
    return { isValid: false, error: 'No code provided' };
  }
  
  const normalizedCode = code.trim().toUpperCase();
  
  try {
    const codeRef = doc(db, 'referral_codes', normalizedCode);
    const codeSnap = await getDoc(codeRef);
    
    if (!codeSnap.exists()) {
      return { isValid: false, error: 'Código de referidos no encontrado' };
    }
    
    const codeData = codeSnap.data() as ReferralCode;
    
    if (codeData.status !== 'active') {
      return { isValid: false, error: 'Código de referidos inactivo' };
    }
    
    // Prevent self-referral
    if (buyerUserId && codeData.ownerUserId === buyerUserId) {
      return { isValid: false, error: 'No se permite auto-referirse' };
    }
    
    return {
      isValid: true,
      code: normalizedCode,
      referrerUserId: codeData.ownerUserId,
      referrerRole: codeData.ownerRole,
    };
  } catch (error) {
    console.error('Error resolving referral code:', error);
    return { isValid: false, error: 'Error al validar el código' };
  }
}

/**
 * Record a referral conversion (idempotent)
 */
export async function recordReferralConversion(data: {
  referrerUserId: string;
  referrerRole: 'alumno' | 'academia';
  referralCode: string;
  buyerUserId: string;
  buyerEmail: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}): Promise<void> {
  try {
    // Check for existing referral with same session ID (idempotency)
    const existingQuery = query(
      collection(db, 'referrals'),
      where('stripeSessionId', '==', data.stripeSessionId)
    );
    const existingSnap = await getDocs(existingQuery);
    
    if (!existingSnap.empty) {
      console.log('Referral already processed for session:', data.stripeSessionId);
      return;
    }
    
    // Create referral record and update referrer stats in transaction
    await runTransaction(db, async (transaction) => {
      // Create referral document
      const referralData: Omit<Referral, 'id'> = {
        referrerUserId: data.referrerUserId,
        referrerRole: data.referrerRole,
        referralCode: data.referralCode,
        buyerUserId: data.buyerUserId,
        buyerEmail: data.buyerEmail,
        amount: data.amount,
        currency: data.currency,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        status: 'approved',
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      
      const referralRef = doc(collection(db, 'referrals'));
      transaction.set(referralRef, referralData);
      
      // Update referrer's stats
      const referrerRef = doc(db, 'users', data.referrerUserId);
      const referrerSnap = await transaction.get(referrerRef);
      
      if (referrerSnap.exists()) {
        const referrerData = referrerSnap.data();
        const currentCount = referrerData.referralsCount || 0;
        const currentRevenue = referrerData.referralsRevenue || 0;
        
        transaction.update(referrerRef, {
          referralsCount: currentCount + 1,
          referralsRevenue: currentRevenue + data.amount,
        });
      }
    });
    
    console.log('Referral conversion recorded successfully');
  } catch (error) {
    console.error('Error recording referral conversion:', error);
    throw error;
  }
}

/**
 * Record a failed referral attempt
 */
export async function recordFailedReferral(data: {
  referrerUserId?: string;
  referrerRole?: 'alumno' | 'academia';
  referralCode: string;
  buyerUserId: string;
  buyerEmail: string;
  stripeSessionId: string;
  reason: string;
}): Promise<void> {
  try {
    const referralData: Omit<Referral, 'id'> = {
      referrerUserId: data.referrerUserId || '',
      referrerRole: data.referrerRole || 'alumno',
      referralCode: data.referralCode,
      buyerUserId: data.buyerUserId,
      buyerEmail: data.buyerEmail,
      amount: 0,
      currency: 'EUR',
      stripeSessionId: data.stripeSessionId,
      status: 'rejected',
      reason: data.reason,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    };
    
    await addDoc(collection(db, 'referrals'), referralData);
  } catch (error) {
    console.error('Error recording failed referral:', error);
  }
}

/**
 * Get referral metrics for admin dashboard
 */
export async function getReferralMetrics(): Promise<ReferralMetrics> {
  try {
    // Get all approved referrals
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('status', '==', 'approved'),
      orderBy('createdAtMs', 'desc')
    );
    
    const referralsSnap = await getDocs(referralsQuery);
    const referrals = referralsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Referral[];
    
    // Get all referral attempts for conversion rate
    const allReferralsQuery = query(collection(db, 'referrals'));
    const allReferralsSnap = await getDocs(allReferralsQuery);
    
    const totalAttempts = allReferralsSnap.size;
    const totalApproved = referrals.length;
    const totalRevenue = referrals.reduce((sum, ref) => sum + ref.amount, 0);
    const conversionRate = totalAttempts > 0 ? (totalApproved / totalAttempts) * 100 : 0;
    
    // Calculate top referrers
    const referrerStats = new Map<string, { 
      userId: string; 
      email: string; 
      role: 'alumno' | 'academia'; 
      count: number; 
      revenue: number; 
    }>();
    
    for (const referral of referrals) {
      const key = referral.referrerUserId;
      if (referrerStats.has(key)) {
        const stats = referrerStats.get(key)!;
        stats.count += 1;
        stats.revenue += referral.amount;
      } else {
        referrerStats.set(key, {
          userId: referral.referrerUserId,
          email: referral.buyerEmail, // This should be referrer email, but we'll get it from users collection
          role: referral.referrerRole,
          count: 1,
          revenue: referral.amount,
        });
      }
    }
    
    const topReferrers = Array.from(referrerStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(stats => ({
        userId: stats.userId,
        email: stats.email,
        role: stats.role,
        referralsCount: stats.count,
        revenue: stats.revenue,
      }));
    
    return {
      totalReferrals: totalApproved,
      totalRevenue,
      conversionRate,
      topReferrers,
    };
  } catch (error) {
    console.error('Error getting referral metrics:', error);
    throw error;
  }
}

/**
 * Get referrals for a specific user
 */
export async function getUserReferrals(userId: string): Promise<Referral[]> {
  try {
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerUserId', '==', userId),
      orderBy('createdAtMs', 'desc')
    );
    
    const referralsSnap = await getDocs(referralsQuery);
    return referralsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Referral[];
  } catch (error) {
    console.error('Error getting user referrals:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time referrals updates
 */
export function subscribeToReferrals(
  callback: (referrals: Referral[]) => void,
  limitCount: number = 100
): Unsubscribe {
  const referralsQuery = query(
    collection(db, 'referrals'),
    orderBy('createdAtMs', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(referralsQuery, (snapshot) => {
    const referrals = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Referral[];
    callback(referrals);
  });
}
