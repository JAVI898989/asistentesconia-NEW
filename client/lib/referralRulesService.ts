import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { ReferralRule } from "@/types/referral";

// Default referral rules
const DEFAULT_REFERRAL_RULES: ReferralRule[] = [
  {
    referrerRole: 'alumno',
    referredRole: 'alumno',
    referrerBenefit: {
      type: 'months_free',
      months: 1,
      description: '1 mes gratis por referido (alumno)'
    }
  },
  {
    referrerRole: 'alumno',
    referredRole: 'academia',
    referrerBenefit: {
      type: 'months_free',
      months: 12,
      description: '1 año gratis por traer una academia'
    }
  },
  {
    referrerRole: 'academia',
    referredRole: 'alumno',
    referrerBenefit: {
      type: 'months_free',
      months: 2,
      description: '2 meses gratis por alumno referido'
    }
  },
  {
    referrerRole: 'academia',
    referredRole: 'academia',
    referrerBenefit: {
      type: 'months_free',
      months: 6,
      description: '6 meses gratis por academia referida'
    }
  }
];

/**
 * Get referral rules (from Firestore or defaults)
 */
export async function getReferralRules(): Promise<ReferralRule[]> {
  try {
    const rulesRef = doc(db, 'referral_rules', 'default');
    const rulesSnap = await getDoc(rulesRef);
    
    if (rulesSnap.exists()) {
      const data = rulesSnap.data();
      return data.rules || DEFAULT_REFERRAL_RULES;
    }
    
    // Initialize with default rules
    await setDoc(rulesRef, {
      rules: DEFAULT_REFERRAL_RULES,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    
    return DEFAULT_REFERRAL_RULES;
  } catch (error) {
    console.error('Error getting referral rules:', error);
    return DEFAULT_REFERRAL_RULES;
  }
}

/**
 * Find the appropriate benefit for a referral
 */
export async function getBenefitForReferral(
  referrerRole: 'alumno' | 'academia',
  referredRole: 'alumno' | 'academia'
): Promise<ReferralRule | null> {
  const rules = await getReferralRules();
  
  return rules.find(rule => 
    rule.referrerRole === referrerRole && 
    rule.referredRole === referredRole
  ) || null;
}

/**
 * Calculate end date by adding months
 */
export function addMonths(startDate: Date, months: number): Date {
  const result = new Date(startDate);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Calculate days remaining until entitlement expires
 */
export function getDaysRemaining(endTimestamp: number): number {
  const now = Date.now();
  const diffMs = endTimestamp - now;
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Check if user has active entitlement
 */
export function hasActiveEntitlement(entitlementEndAtMs?: number): boolean {
  if (!entitlementEndAtMs) return false;
  return entitlementEndAtMs > Date.now();
}

/**
 * Format entitlement period for display
 */
export function formatEntitlementPeriod(startsAtMs: number, endsAtMs: number): string {
  const startDate = new Date(startsAtMs).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const endDate = new Date(endsAtMs).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return `${startDate} - ${endDate}`;
}

/**
 * Get human-readable time remaining
 */
export function getTimeRemaining(endTimestamp: number): string {
  const daysLeft = getDaysRemaining(endTimestamp);
  
  if (daysLeft === 0) return 'Expira hoy';
  if (daysLeft === 1) return '1 día restante';
  if (daysLeft < 30) return `${daysLeft} días restantes`;
  
  const monthsLeft = Math.floor(daysLeft / 30);
  if (monthsLeft === 1) return '1 mes restante';
  if (monthsLeft < 12) return `${monthsLeft} meses restantes`;
  
  const yearsLeft = Math.floor(monthsLeft / 12);
  if (yearsLeft === 1) return '1 año restante';
  return `${yearsLeft} años restantes`;
}
