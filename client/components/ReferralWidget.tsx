import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Gift,
  Copy,
  Share2,
  Crown,
  Calendar,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { getUserReferralStats } from "@/lib/enhancedReferralService";
import { hasActiveEntitlement, getTimeRemaining } from "@/lib/referralRulesService";
import type { ReferralStats } from "@/types/referral";

interface ReferralWidgetProps {
  userId: string;
  userEmail: string;
  userRole: 'alumno' | 'academia';
  referralCode: string;
  compact?: boolean;
  showInHeader?: boolean;
}

export default function ReferralWidget({
  userId,
  userEmail,
  userRole,
  referralCode,
  compact = false,
  showInHeader = false,
}: ReferralWidgetProps) {
  const [stats, setStats] = useState<ReferralStats>({
    totalActivated: 0,
    totalBenefitMonths: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const userStats = await getUserReferralStats(userId);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Código copiado al portapapeles");
    } catch (err) {
      toast.error("Error al copiar el código");
    }
  };

  const shareReferralLink = async () => {
    const shareUrl = `${window.location.origin}?ref=${referralCode}`;
    const shareData = {
      title: 'Únete con mi código de referidos',
      text: `¡Usa mi código de referidos ${referralCode} y obtén beneficios especiales!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const hasActiveBenefits = hasActiveEntitlement(stats.currentEntitlementEnd);

  if (loading) {
    return (
      <div className={`${compact ? 'w-48' : 'w-full'} h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg animate-pulse`} />
    );
  }

  // Header version (very compact)
  if (showInHeader) {
    return (
      <TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 hover:from-green-500/30 hover:to-blue-500/30"
            >
              <Gift className="w-4 h-4 mr-2" />
              <span className="font-mono">{referralCode}</span>
              {hasActiveBenefits && (
                <Crown className="w-3 h-3 ml-1 text-yellow-400" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="text-center">
                <h4 className="font-semibold">Tu Código de Referidos</h4>
                <div className="font-mono text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg mt-2">
                  {referralCode}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.totalActivated}</div>
                  <div className="text-gray-600">Referidos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600">{stats.totalBenefitMonths}</div>
                  <div className="text-gray-600">Meses gratis</div>
                </div>
              </div>

              {hasActiveBenefits && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                  <Crown className="w-4 h-4 inline text-yellow-600 mr-1" />
                  <span className="text-sm font-medium text-yellow-800">
                    {getTimeRemaining(stats.currentEntitlementEnd!)}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={copyReferralCode} size="sm" variant="outline" className="flex-1">
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </Button>
                <Button onClick={shareReferralLink} size="sm" className="flex-1">
                  <Share2 className="w-3 h-3 mr-1" />
                  Invitar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    );
  }

  // Compact version for sidebars
  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tu código</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
            </div>
            
            <div className="font-mono font-bold text-green-600">
              {referralCode}
            </div>

            {isExpanded && (
              <>
                <div className="flex justify-between text-xs">
                  <span>{stats.totalActivated} referidos</span>
                  <span className="text-green-600">{stats.totalBenefitMonths} meses</span>
                </div>

                {hasActiveBenefits && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    {stats.daysRemaining} días restantes
                  </Badge>
                )}

                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={copyReferralCode} size="sm" variant="outline" className="h-6 px-2 text-xs">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copiar código</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={shareReferralLink} size="sm" className="h-6 px-2 text-xs flex-1">
                          <Share2 className="w-3 h-3 mr-1" />
                          Invitar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Compartir enlace</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for main areas
  return (
    <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Sistema de Referidos</span>
            </div>
            {hasActiveBenefits && (
              <Badge className="bg-yellow-500/20 text-yellow-600">
                <Crown className="w-3 h-3 mr-1" />
                Plan Activo
              </Badge>
            )}
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Tu código de referidos</div>
            <div className="font-mono text-xl font-bold text-green-600 bg-white/50 px-4 py-2 rounded-lg">
              {referralCode}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.totalActivated}</div>
              <div className="text-sm text-gray-600">Referidos Activados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.totalBenefitMonths}</div>
              <div className="text-sm text-gray-600">Meses Gratis</div>
            </div>
            <div>
              {hasActiveBenefits ? (
                <>
                  <div className="text-2xl font-bold text-yellow-600">{stats.daysRemaining || 0}</div>
                  <div className="text-sm text-gray-600">Días Restantes</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                  <div className="text-sm text-gray-600">Sin Beneficios</div>
                </>
              )}
            </div>
          </div>

          {hasActiveBenefits && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <Calendar className="w-4 h-4 inline text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Plan activo hasta: {getTimeRemaining(stats.currentEntitlementEnd!)}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={copyReferralCode} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código
            </Button>
            <Button onClick={shareReferralLink} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Invitar Amigos
            </Button>
          </div>

          <div className="text-xs text-gray-600 text-center">
            Refiere academias y obtén hasta 12 meses gratis • Refiere alumnos y obtén 1 mes gratis
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
