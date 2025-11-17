import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Euro, 
  Gift, 
  Copy, 
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { useUserReferralCode, useUserReferrals } from "@/hooks/useReferrals";

interface UserReferralDashboardProps {
  userId: string;
  userEmail: string;
  role: 'alumno' | 'academia';
}

export default function UserReferralDashboard({
  userId,
  userEmail,
  role,
}: UserReferralDashboardProps) {
  const { referralCode, loading: codeLoading } = useUserReferralCode(userId, userEmail, role);
  const { referrals, stats, loading: referralsLoading } = useUserReferrals(userId);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Código copiado al portapapeles");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Código copiado al portapapeles");
      } catch (err) {
        toast.error("Error al copiar el código");
      }
      document.body.removeChild(textArea);
    }
  };

  const shareReferralCode = async () => {
    if (!referralCode) return;
    
    const shareData = {
      title: 'Únete con mi código de referidos',
      text: `¡Usa mi código de referidos ${referralCode} y obtén beneficios especiales!`,
      url: window.location.origin + `?ref=${referralCode}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(`${shareData.text} ${shareData.url}`);
      }
    } else {
      copyToClipboard(`${shareData.text} ${shareData.url}`);
    }
  };

  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default" as const,
      rejected: "destructive" as const,
      pending: "secondary" as const,
    };
    
    const labels = {
      approved: "Aprobado",
      rejected: "Rechazado", 
      pending: "Pendiente",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Mi Programa de Referidos
        </h2>
        <p className="text-gray-600">
          Invita a otros usuarios y obtén beneficios por cada referido que se suscriba.
        </p>
      </div>

      {/* Referral Code Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            Tu Código de Referidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codeLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Generando código...</span>
            </div>
          ) : referralCode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex-1">
                  <div className="font-mono text-2xl font-bold text-blue-900 text-center">
                    {referralCode}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={shareReferralCode}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Gift className="w-4 h-4" />
                <AlertDescription>
                  <strong>¿Cómo funciona?</strong> Comparte tu código con otros usuarios. 
                  Cuando se suscriban usando tu código, tanto tú como ellos pueden obtener beneficios especiales.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                Error al cargar tu código de referidos. Inténtalo de nuevo más tarde.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referidos Exitosos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios que se suscribieron
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Volumen Generado
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total en ventas referidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
            <p className="text-xs text-muted-foreground">
              En proceso de validación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Referidos</CardTitle>
        </CardHeader>
        <CardContent>
          {referralsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando historial...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aún no tienes referidos
              </h3>
              <p className="text-gray-600 mb-4">
                Comparte tu código de referidos para empezar a generar ingresos.
              </p>
              <Button onClick={shareReferralCode} disabled={!referralCode}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir mi código
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.buyerEmail}</div>
                          <div className="text-sm text-gray-500">
                            {referral.buyerUserId.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">
                          {formatCurrency(referral.amount)}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {referral.currency}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(referral.status)}
                          {getStatusBadge(referral.status)}
                        </div>
                        {referral.reason && (
                          <div className="text-xs text-red-600 mt-1">
                            {referral.reason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(referral.createdAtMs)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
