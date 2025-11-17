import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  Euro, 
  Target, 
  Gift, 
  School,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { subscribeToReferrals, getReferralMetrics } from "@/lib/referralService";
import type { Referral, ReferralMetrics } from "@/types/referral";

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    loadMetrics();
    
    // Subscribe to real-time referrals
    const unsubscribe = subscribeToReferrals((newReferrals) => {
      setReferrals(newReferrals);
      setLoading(false);
    }, 100);

    return () => unsubscribe();
  }, []);

  const loadMetrics = async () => {
    try {
      const metricsData = await getReferralMetrics();
      setMetrics(metricsData);
    } catch (err) {
      setError("Error al cargar métricas de referidos");
      console.error("Error loading referral metrics:", err);
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    if (statusFilter !== "all" && referral.status !== statusFilter) return false;
    if (roleFilter !== "all" && referral.referrerRole !== roleFilter) return false;
    return true;
  });

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sistema de Referidos
            </h1>
            <p className="text-gray-600">
              Gestión y análisis del programa de referidos
            </p>
          </div>
          <Button onClick={loadMetrics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Referidos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalReferrals}</div>
                <p className="text-xs text-muted-foreground">
                  Conversiones exitosas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos por Referidos
                </CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Volumen total generado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Conversión
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.conversionRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Referidos exitosos / intentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Referidores
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.topReferrers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Usuarios activos
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Referrers */}
        {metrics && metrics.topReferrers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Referidores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topReferrers.slice(0, 5).map((referrer, index) => (
                  <div key={referrer.userId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{referrer.email}</div>
                        <div className="flex items-center gap-2">
                          {referrer.role === 'academia' ? (
                            <School className="w-3 h-3" />
                          ) : (
                            <Gift className="w-3 h-3" />
                          )}
                          <span className="text-sm text-gray-600 capitalize">
                            {referrer.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(referrer.revenue)}</div>
                      <div className="text-sm text-gray-600">
                        {referrer.referralsCount} referido{referrer.referralsCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Referidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="approved">Aprobados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="alumno">Alumnos</SelectItem>
                  <SelectItem value="academia">Academias</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredReferrals.length} de {referrals.length} referidos
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando referidos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Referidor</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {referral.referralCode}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {referral.referrerRole === 'academia' ? (
                              <School className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Gift className="w-4 h-4 text-green-600" />
                            )}
                            <div>
                              <div className="text-sm text-gray-600 capitalize">
                                {referral.referrerRole}
                              </div>
                              <div className="font-mono text-xs text-gray-500">
                                {referral.referrerUserId.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.buyerEmail}</div>
                            <div className="font-mono text-xs text-gray-500">
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
                          {referral.stripeSessionId && (
                            <div className="font-mono text-xs text-gray-500">
                              {referral.stripeSessionId.slice(-8)}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredReferrals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No se encontraron referidos con los filtros seleccionados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
