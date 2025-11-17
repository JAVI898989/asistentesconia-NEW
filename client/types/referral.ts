export interface User {
  uid: string;
  email: string;
  role: 'alumno' | 'academia' | 'admin';
  referralCode: string;
  referredByCode?: string;
  referredByUserId?: string;
  referralsCount?: number;
  referralsRevenue?: number; // in cents
  entitlementEndAtMs?: number; // fecha fin de "mes/año gratis"
  createdAt: any;
  createdAtMs: number;
}

export interface ReferralCode {
  code: string; // docId
  ownerUserId: string;
  ownerRole: 'alumno' | 'academia';
  createdAt: any;
  createdAtMs: number;
  status: 'active';
}

export interface Referral {
  id?: string;
  referrerUserId: string;
  referrerRole: 'alumno' | 'academia';
  referralCode: string;
  buyerUserId: string;
  buyerEmail: string;
  buyerRole?: 'alumno' | 'academia';
  amount: number; // in cents
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  // NEW: Activation and benefits
  activated: boolean; // true si hay pago/condición cumplida
  activatedAtMs?: number;
  benefitReferrer?: {
    type: 'months_free' | 'year_free' | 'discount';
    months?: number;
    description: string;
  };
  benefitReferred?: {
    type?: 'discount' | 'months_free';
    months?: number;
    description?: string;
  };
  createdAt: any;
  createdAtMs: number;
}

export interface ReferralMetrics {
  totalReferrals: number;
  totalRevenue: number;
  conversionRate: number;
  topReferrers: Array<{
    userId: string;
    email: string;
    role: 'alumno' | 'academia';
    referralsCount: number;
    revenue: number;
  }>;
}

export interface ReferralValidationResult {
  isValid: boolean;
  code?: string;
  referrerUserId?: string;
  referrerRole?: 'alumno' | 'academia';
  error?: string;
}

export interface ReferralReward {
  id?: string;
  userId: string;
  sourceReferralId: string; // vínculo a referrals/{id}
  type: 'months_free' | 'year_free';
  months: number; // 1 o 12 según regla
  appliedAtMs: number;
  startsAtMs: number;
  endsAtMs: number; // periodo concedido
  status: 'granted' | 'revoked';
  note?: string;
}

export interface ReferralRule {
  referrerRole: 'alumno' | 'academia';
  referredRole: 'alumno' | 'academia';
  referrerBenefit: {
    type: 'months_free' | 'year_free' | 'discount';
    months: number;
    description: string;
  };
  referredBenefit?: {
    type: 'discount' | 'months_free';
    months?: number;
    description?: string;
  };
}

export interface ReferralStats {
  totalActivated: number;
  totalBenefitMonths: number;
  currentEntitlementEnd?: number;
  daysRemaining?: number;
}
