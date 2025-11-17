import { useState, useEffect } from "react";
import { 
  ensureUserHasReferralCode, 
  getUserReferrals, 
  getReferralMetrics,
  subscribeToReferrals 
} from "@/lib/referralService";
import type { Referral, ReferralMetrics } from "@/types/referral";

export function useUserReferralCode(
  userId: string | null, 
  userEmail: string | null, 
  role: 'alumno' | 'academia' | null
) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && userEmail && role) {
      loadReferralCode();
    }
  }, [userId, userEmail, role]);

  const loadReferralCode = async () => {
    if (!userId || !userEmail || !role) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const code = await ensureUserHasReferralCode(userId, userEmail, role);
      setReferralCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar código de referidos');
    } finally {
      setLoading(false);
    }
  };

  return {
    referralCode,
    loading,
    error,
    reload: loadReferralCode,
  };
}

export function useUserReferrals(userId: string | null) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadReferrals();
    }
  }, [userId]);

  const loadReferrals = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userReferrals = await getUserReferrals(userId);
      setReferrals(userReferrals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar referidos');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalReferrals: referrals.filter(r => r.status === 'approved').length,
    totalRevenue: referrals
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0),
    pendingReferrals: referrals.filter(r => r.status === 'pending').length,
  };

  return {
    referrals,
    stats,
    loading,
    error,
    reload: loadReferrals,
  };
}

export function useReferralMetrics() {
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const metricsData = await getReferralMetrics();
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
  };
}

export function useRealTimeReferrals(limit: number = 50) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToReferrals((newReferrals) => {
      setReferrals(newReferrals);
      setLoading(false);
    }, limit);

    return () => unsubscribe();
  }, [limit]);

  return {
    referrals,
    loading,
  };
}
