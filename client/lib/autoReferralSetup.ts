import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { ensureUserHasReferralCode } from "./referralService";

/**
 * Initialize referral system for a new or existing user
 */
export async function initializeUserReferralSystem(
  userId: string,
  email: string,
  role: 'alumno' | 'academia' = 'alumno',
  referredByCode?: string
): Promise<void> {
  try {
    console.log(`🎯 Initializing referral system for user: ${userId}`);

    // Check if user already exists in our system
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    let userData: any = {
      uid: userId,
      email,
      role,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
      referralsCount: 0,
      referralsRevenue: 0,
    };

    // If user exists, preserve existing data
    if (userSnap.exists()) {
      const existingData = userSnap.data();
      userData = { ...existingData, ...userData };
      console.log(`✅ User exists, updating referral data`);
    } else {
      console.log(`🆕 New user, creating profile`);
    }

    // Handle referral by code (if user was referred)
    if (referredByCode) {
      console.log(`🔗 Processing referral by code: ${referredByCode}`);
      
      // Validate and resolve the referral code
      const { resolveReferralCode } = await import("./referralService");
      const referralValidation = await resolveReferralCode(referredByCode, userId);
      
      if (referralValidation.isValid) {
        userData.referredByCode = referralValidation.code;
        userData.referredByUserId = referralValidation.referrerUserId;
        console.log(`✅ Valid referral code applied: ${referralValidation.code}`);
      } else {
        console.log(`❌ Invalid referral code: ${referralValidation.error}`);
      }
    }

    // Generate referral code if user doesn't have one
    if (!userData.referralCode) {
      console.log(`🎲 Generating referral code for user`);
      const referralCode = await ensureUserHasReferralCode(userId, email, role);
      userData.referralCode = referralCode;
      console.log(`✅ Referral code generated: ${referralCode}`);
    }

    // Save/update user data
    await setDoc(userRef, userData, { merge: true });
    
    console.log(`✅ Referral system initialized for user: ${userId}`);
  } catch (error) {
    console.error(`❌ Error initializing referral system for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Extract referral code from URL parameters
 */
export function extractReferralCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('ref');
  
  if (referralCode) {
    // Store in session storage for later use during signup
    sessionStorage.setItem('pendingReferralCode', referralCode.toUpperCase());
    console.log(`🔗 Referral code detected in URL: ${referralCode}`);
    return referralCode.toUpperCase();
  }
  
  // Check if there's a pending referral code in session storage
  const pendingCode = sessionStorage.getItem('pendingReferralCode');
  if (pendingCode) {
    console.log(`🔗 Pending referral code found: ${pendingCode}`);
    return pendingCode;
  }
  
  return null;
}

/**
 * Clear pending referral code after successful signup
 */
export function clearPendingReferralCode(): void {
  sessionStorage.removeItem('pendingReferralCode');
}

/**
 * Auto-setup referral system during user authentication
 */
export async function autoSetupReferralOnAuth(
  userId: string,
  email: string,
  isNewUser: boolean = false
): Promise<void> {
  try {
    // Determine user role (you might want to customize this logic)
    const role: 'alumno' | 'academia' = email.includes('academia') || email.includes('escuela') ? 'academia' : 'alumno';
    
    // Extract referral code from URL or session storage
    const referralCode = extractReferralCodeFromUrl();
    
    // Initialize referral system
    await initializeUserReferralSystem(userId, email, role, referralCode || undefined);
    
    // Clear pending referral code if this was a new signup
    if (isNewUser && referralCode) {
      clearPendingReferralCode();
    }
    
    console.log(`✅ Auto-setup referral system completed for: ${email}`);
  } catch (error) {
    console.error(`❌ Error in auto-setup referral system:`, error);
    // Don't throw error to avoid breaking authentication flow
  }
}

/**
 * Get user's referral code quickly (cached)
 */
export async function getUserReferralCode(userId: string): Promise<string | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.referralCode || null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting user referral code:`, error);
    return null;
  }
}

/**
 * Check if user was referred by someone
 */
export async function getUserReferralInfo(userId: string): Promise<{
  wasReferred: boolean;
  referredByCode?: string;
  referredByUserId?: string;
} | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        wasReferred: Boolean(userData.referredByCode),
        referredByCode: userData.referredByCode,
        referredByUserId: userData.referredByUserId,
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting user referral info:`, error);
    return null;
  }
}
