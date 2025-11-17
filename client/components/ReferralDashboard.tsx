import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Calendar,
  Gift,
  CheckCircle,
  Clock,
  Crown,
  Copy,
  Share2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import ReferralIndexError from "./ReferralIndexError";
import {
  subscribeToUserReferralStats,
  subscribeToUserReferrals,
  getUserReferralStats
} from "@/lib/enhancedReferralService";
import {
  formatEntitlementPeriod,
  getTimeRemaining,
  hasActiveEntitlement
} from "@/lib/referralRulesService";
import type { ReferralStats, Referral, ReferralReward } from "@/types/referral";

interface ReferralDashboardProps {
  userId: string;
  userEmail: string;
  userRole: 'alumno' | 'academia';
  referralCode: string;
}

export default function ReferralDashboard({
  userId,
  userEmail,
  userRole,
  referralCode
}: ReferralDashboardProps) {
  const [stats, setStats] = useState<ReferralStats>({
    totalActivated: 0,
    totalBenefitMonths: 0,
  });
  const [referrals, setReferrals] = useState<(Referral & { reward?: ReferralReward })[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to real-time stats
    const unsubscribeStats = subscribeToUserReferralStats(userId, (newStats) => {
      setStats(newStats);
      setLoading(false);
    });

    // Subscribe to real-time referrals with error handling
    const unsubscribeReferrals = subscribeToUserReferrals(
      userId,
      (newReferrals) => {
        setReferrals(newReferrals);
        setIndexError(false); // Clear error if data loads successfully
        setLoading(false);
      },
      () => {
        // Index error callback
        setIndexError(true);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeStats();
      unsubscribeReferrals();
    };
  }, [userId]);

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Código copiado al portapapeles");
    } catch (err) {
      toast.error("Error al copiar el código");
    }
  };

  const shareReferralCode = async () => {
    const shareData = {
      title: 'Únete con mi código de referidos',
      text: `¡Usa mi código de referidos ${referralCode} y obtén beneficios especiales!`,
      url: window.location.origin + `?ref=${referralCode}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyReferralCode();
      }
    } else {
      copyReferralCode();
    }
  };

  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivationStatus = (referral: Referral) => {
    if (referral.activated && referral.activatedAtMs) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: "Activado",
        date: formatDate(referral.activatedAtMs),
        variant: "default" as const
      };
    }

    return {
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      text: "Pendiente",
      date: "",
      variant: "secondary" as const
    };
  };

  const hasActiveSubscription = hasActiveEntitlement(stats.currentEntitlementEnd);

  const handleRetry = () => {
    setLoading(true);
    setIndexError(false);

    // Force reload of data
    window.location.reload();
  };

  // Show index error if detected
  if (indexError) {
    return <ReferralIndexError onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Mi Programa de Referidos
          </h2>
          <p className="text-gray-600">
            Invita usuarios y obtén meses gratis de suscripción
          </p>
        </div>

        {/* Referral Code Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-xs text-blue-600 font-medium mb-1">Tu código</div>
                <div className="font-mono text-lg font-bold text-blue-900">
                  {referralCode}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
                <Button size="sm" variant="outline" onClick={shareReferralCode}>
                  <Share2 className="w-3 h-3 mr-1" />
                  Compartir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referidos Activados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivated}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios que completaron pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meses Gratis Totales
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBenefitMonths}</div>
            <p className="text-xs text-muted-foreground">
              Beneficios acumulados
            </p>
          </CardContent>
        </Card>

        <Card className={hasActiveSubscription ? "border-green-200 bg-green-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plan Actual
            </CardTitle>
            {hasActiveSubscription ? (
              <Crown className="h-4 w-4 text-green-600" />
            ) : (
              <Calendar className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            {hasActiveSubscription ? (
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.daysRemaining || 0}
                </div>
                <p className="text-xs text-green-700">
                  {getTimeRemaining(stats.currentEntitlementEnd!)}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  Plan Básico
                </div>
                <p className="text-xs text-gray-600">
                  Refiere usuarios para obtener beneficios
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Historial de Referidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando referidos...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aún no tienes referidos
              </h3>
              <p className="text-gray-600 mb-4">
                Comparte tu código de referidos para empezar a generar beneficios
              </p>
              <Button onClick={shareReferralCode}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir código
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Con quién</TableHead>
                  <TableHead>Activado</TableHead>
                  <TableHead>Beneficio obtenido</TableHead>
                  <TableHead>Vigencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => {
                  const activationStatus = getActivationStatus(referral);

                  return (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {referral.buyerEmail.split('@')[0]}***
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {referral.buyerRole || 'alumno'}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {activationStatus.icon}
                          <div>
                            <Badge variant={activationStatus.variant}>
                              {activationStatus.text}
                            </Badge>
                            {activationStatus.date && (
                              <div className="text-xs text-gray-500 mt-1">
                                {activationStatus.date}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {referral.benefitReferrer ? (
                          <div>
                            <div className="font-medium text-green-600">
                              {referral.benefitReferrer.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(referral.amount)} convertido
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {referral.reward ? (
                          <div>
                            <div className="text-sm font-medium">
                              {formatEntitlementPeriod(
                                referral.reward.startsAtMs,
                                referral.reward.endsAtMs
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {referral.reward.months} mes{referral.reward.months !== 1 ? 'es' : ''}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
