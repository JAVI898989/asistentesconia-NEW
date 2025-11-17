export interface FamilyPackTier {
  monthly: { priceId: string; price: number; slots: number };
  annual: { priceId: string; price: number; slots: number };
  featured: boolean;
}

export interface FamilyPackSettings {
  enabled: boolean;
  limit: number; // limite total de packs vendidos (mensual+anual)
  annualDiscountMonths: number; // meses gratis por prepago (cálculo UI)
  tiers: {
    "3": FamilyPackTier;
    "5": FamilyPackTier;
    "8": FamilyPackTier;
  };
  addonPublic: {
    monthly: { priceId: string; price: number };
    annual: { priceId: string; price: number };
  };
}

export interface FamilyPackCounter {
  limit: number;
  sold: number;
  updatedAtMs: number;
}

export interface FamilyPackCheckoutData {
  tier: '3' | '5' | '8';
  billingCycle: 'monthly' | 'annual';
  addonPublicCount: number;
  referralCode?: string;
}

export interface FamilyPackSubscription {
  plan: 'family';
  tier: '3' | '5' | '8';
  tierSlots: number;
  addonPublicSlots: number;
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'inactive' | 'cancelled';
  currentPeriodEnd: number;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  createdAt: any;
  updatedAt: any;
}

export interface FamilyPackPricingData {
  tier: '3' | '5' | '8';
  monthlyPrice: number;
  annualPrice: number;
  slots: number;
  featured?: boolean;
  savings?: number; // calculated from annualDiscountMonths
}
