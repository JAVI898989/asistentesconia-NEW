import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  FamilyPackSettings,
  FamilyPackCounter,
  FamilyPackPricingData,
  FamilyPackCheckoutData,
} from "@/types/familyPack";

/**
 * Get family pack settings from Firestore
 */
export async function getFamilyPackSettings(): Promise<FamilyPackSettings | null> {
  try {
    const settingsRef = doc(db, 'settings', 'pricing');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return data.family || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting family pack settings:', error);
    return null;
  }
}

/**
 * Update family pack settings (admin only)
 */
export async function updateFamilyPackSettings(settings: FamilyPackSettings): Promise<void> {
  try {
    const settingsRef = doc(db, 'settings', 'pricing');
    await updateDoc(settingsRef, {
      family: settings,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating family pack settings:', error);
    throw error;
  }
}

/**
 * Get family pack counter (stock information)
 */
export async function getFamilyPackCounter(): Promise<FamilyPackCounter | null> {
  try {
    const counterRef = doc(db, 'counters', 'family_packs');
    const counterSnap = await getDoc(counterRef);
    
    if (counterSnap.exists()) {
      return counterSnap.data() as FamilyPackCounter;
    }
    return null;
  } catch (error) {
    console.error('Error getting family pack counter:', error);
    return null;
  }
}

/**
 * Initialize family pack counter if it doesn't exist
 */
export async function initializeFamilyPackCounter(limit: number = 200): Promise<void> {
  try {
    const counterRef = doc(db, 'counters', 'family_packs');
    const counterSnap = await getDoc(counterRef);
    
    if (!counterSnap.exists()) {
      await setDoc(counterRef, {
        limit,
        sold: 0,
        updatedAtMs: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error initializing family pack counter:', error);
    throw error;
  }
}

/**
 * Increment family pack sold counter (used by webhook)
 */
export async function incrementFamilyPackCounter(): Promise<void> {
  try {
    const counterRef = doc(db, 'counters', 'family_packs');
    await updateDoc(counterRef, {
      sold: increment(1),
      updatedAtMs: Date.now(),
    });
  } catch (error) {
    console.error('Error incrementing family pack counter:', error);
    throw error;
  }
}

/**
 * Get family pack pricing data for UI display
 */
export async function getFamilyPackPricing(): Promise<{
  packs: FamilyPackPricingData[];
  addonPrice: { monthly: number; annual: number };
  remaining: number;
  settings: FamilyPackSettings | null;
} | null> {
  try {
    const [settings, counter] = await Promise.all([
      getFamilyPackSettings(),
      getFamilyPackCounter(),
    ]);

    if (!settings || !counter) {
      return null;
    }

    const remaining = Math.max(0, counter.limit - counter.sold);

    const packs: FamilyPackPricingData[] = Object.entries(settings.tiers).map(
      ([tier, tierData]) => {
        const monthlyPrice = tierData.monthly.price;
        const annualPrice = tierData.annual.price;
        const equivalentMonthlyPrice = monthlyPrice * (12 - settings.annualDiscountMonths);
        const savings = ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100;

        return {
          tier: tier as '3' | '5' | '8',
          monthlyPrice,
          annualPrice,
          slots: tierData.monthly.slots,
          featured: tierData.featured,
          savings: Math.round(savings),
        };
      }
    );

    return {
      packs,
      addonPrice: {
        monthly: settings.addonPublic.monthly.price,
        annual: settings.addonPublic.annual.price,
      },
      remaining,
      settings,
    };
  } catch (error) {
    console.error('Error getting family pack pricing:', error);
    return null;
  }
}

/**
 * Validate family pack checkout data
 */
export async function validateFamilyPackCheckout(
  data: FamilyPackCheckoutData
): Promise<{ valid: boolean; error?: string; settings?: FamilyPackSettings; counter?: FamilyPackCounter }> {
  try {
    const [settings, counter] = await Promise.all([
      getFamilyPackSettings(),
      getFamilyPackCounter(),
    ]);

    if (!settings) {
      return { valid: false, error: 'Family pack settings not found' };
    }

    if (!counter) {
      return { valid: false, error: 'Family pack counter not found' };
    }

    if (!settings.enabled) {
      return { valid: false, error: 'Family packs are currently disabled' };
    }

    const remaining = counter.limit - counter.sold;
    if (remaining <= 0) {
      return { valid: false, error: 'No family packs available' };
    }

    if (!['3', '5', '8'].includes(data.tier)) {
      return { valid: false, error: 'Invalid tier selected' };
    }

    if (!['monthly', 'annual'].includes(data.billingCycle)) {
      return { valid: false, error: 'Invalid billing cycle' };
    }

    if (data.addonPublicCount < 0 || data.addonPublicCount > 10) {
      return { valid: false, error: 'Invalid addon count' };
    }

    return { valid: true, settings, counter };
  } catch (error) {
    console.error('Error validating family pack checkout:', error);
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * Calculate total price for family pack checkout
 */
export function calculateFamilyPackPrice(
  settings: FamilyPackSettings,
  data: FamilyPackCheckoutData
): { basePrice: number; addonPrice: number; totalPrice: number; priceIds: string[] } {
  const tierData = settings.tiers[data.tier];
  const priceData = tierData[data.billingCycle];
  const addonData = settings.addonPublic[data.billingCycle];

  const basePrice = priceData.price;
  const addonPrice = addonData.price * data.addonPublicCount;
  const totalPrice = basePrice + addonPrice;

  const priceIds = [priceData.priceId];
  if (data.addonPublicCount > 0) {
    priceIds.push(addonData.priceId);
  }

  return { basePrice, addonPrice, totalPrice, priceIds };
}

/**
 * Get default family pack settings (for admin initialization)
 */
export function getDefaultFamilyPackSettings(): FamilyPackSettings {
  return {
    enabled: true,
    limit: 200,
    annualDiscountMonths: 2,
    tiers: {
      "3": {
        monthly: { priceId: "price_family_3_monthly", price: 30, slots: 3 },
        annual: { priceId: "price_family_3_annual", price: 300, slots: 3 },
        featured: false,
      },
      "5": {
        monthly: { priceId: "price_family_5_monthly", price: 44, slots: 5 },
        annual: { priceId: "price_family_5_annual", price: 440, slots: 5 },
        featured: false,
      },
      "8": {
        monthly: { priceId: "price_family_8_monthly", price: 59, slots: 8 },
        annual: { priceId: "price_family_8_annual", price: 590, slots: 8 },
        featured: true,
      },
    },
    addonPublic: {
      monthly: { priceId: "price_addon_public_monthly", price: 8 },
      annual: { priceId: "price_addon_public_annual", price: 80 },
    },
  };
}
