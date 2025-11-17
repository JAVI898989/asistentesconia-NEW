import type { FamilyPackCheckoutData } from "@/types/familyPack";

const API_BASE = "/api";

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

/**
 * Create Stripe checkout session for family pack
 */
export async function createFamilyPackCheckoutSession(data: {
  checkoutData: FamilyPackCheckoutData;
  userId: string;
  userEmail: string;
  userRole: 'alumno' | 'academia';
}): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch(`${API_BASE}/checkout/family-pack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data.checkoutData,
        userId: data.userId,
        userEmail: data.userEmail,
        userRole: data.userRole,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.url) {
      throw new Error('No checkout URL received from server');
    }

    // Redirect to Stripe Checkout
    window.location.href = result.url;

    return result;
  } catch (error) {
    console.error('Error creating family pack checkout session:', error);
    throw error;
  }
}

/**
 * Validate referral code
 */
export async function validateReferralCode(code: string, userId: string): Promise<{
  isValid: boolean;
  referrerUserId?: string;
  referrerRole?: 'alumno' | 'academia';
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE}/referrals/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { isValid: false, error: errorData.error || 'Validation failed' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating referral code:', error);
    return { isValid: false, error: 'Network error' };
  }
}
