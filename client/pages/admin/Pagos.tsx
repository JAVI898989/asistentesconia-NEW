import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Plus,
  Download,
  Search,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Send,
  Calculator,
  Receipt,
  Users,
  Calendar,
  TrendingUp,
  Euro,
  Wallet,
  BanknoteIcon,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  stripePaymentId?: string;
  userId: string;
  userEmail: string;
  userName: string;
  assistantId?: string;
  assistantName?: string;
  academiaId?: string;
  academiaName?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded" | "disputed";
  paymentMethod: "stripe" | "paypal" | "bank_transfer" | "manual";
  isManual: boolean;
  description: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  invoiceId?: string;
  notes?: string;
  metadata: {
    period: "monthly" | "annual";
    planType: "founder" | "normal";
    discountCode?: string;
    discountAmount?: number;
  };
}

interface Subscription {
  id: string;
  stripeSubscriptionId?: string;
  userId: string;
  userEmail: string;
  userName: string;
  assistantId: string;
  assistantName: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  planType: "founder" | "normal";
  amount: number;
  currency: string;
  interval: "month" | "year";
  createdAt: string;
  canceledAt?: string;
  trialEnd?: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
  failedPaymentCount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  academiaId?: string;
  academiaName?: string;
  amount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  items: InvoiceItem[];
  notes?: string;
  paymentTerms: string;
  pdfUrl?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  assistantId?: string;
  period?: string;
}

interface RefundRequest {
  id: string;
  paymentId: string;
  userId: string;
  userEmail: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "processed";
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export default function Pagos() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  
  // Dialogs state
  const [showCreatePaymentDialog, setShowCreatePaymentDialog] = useState(false);
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);
  const [showPaymentDetailsDialog, setShowPaymentDetailsDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  const { toast } = useToast();

  // Form states
  const [paymentForm, setPaymentForm] = useState({
    userEmail: "",
    assistantId: "",
    academiaId: "",
    amount: 0,
    description: "",
    paymentMethod: "manual" as Payment["paymentMethod"],
    planType: "normal" as "founder" | "normal",
    period: "monthly" as "monthly" | "annual",
    notes: "",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    userEmail: "",
    academiaId: "",
    description: "",
    dueDate: "",
    taxRate: 21,
    paymentTerms: "30 días",
    items: [
      { description: "", quantity: 1, unitPrice: 0 }
    ],
    notes: "",
  });

  const [refundForm, setRefundForm] = useState({
    amount: 0,
    reason: "",
    notes: "",
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      // Simular carga de datos - reemplazar con Firebase/Stripe
      const mockPayments: Payment[] = [
        {
          id: "pay_1",
          stripePaymentId: "pi_1234567890",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          userName: "Juan Pérez",
          assistantId: "guardia-civil",
          assistantName: "Guardia Civil",
          amount: 1800,
          currency: "EUR",
          status: "completed",
          paymentMethod: "stripe",
          isManual: false,
          description: "Suscripción mensual Guardia Civil",
          createdAt: "2024-01-15T10:30:00Z",
          paidAt: "2024-01-15T10:31:00Z",
          invoiceId: "inv_001",
          metadata: {
            period: "monthly",
            planType: "founder",
          },
        },
        {
          id: "pay_2",
          userId: "user2",
          userEmail: "maria@ejemplo.com",
          userName: "María García",
          academiaId: "academia1",
          academiaName: "Academia Oposita",
          amount: 5000,
          currency: "EUR",
          status: "pending",
          paymentMethod: "manual",
          isManual: true,
          description: "Pago manual academia - 3 asistentes",
          createdAt: "2024-01-14T15:20:00Z",
          notes: "Pago acordado por transferencia bancaria",
          metadata: {
            period: "annual",
            planType: "normal",
          },
        },
      ];

      const mockSubscriptions: Subscription[] = [
        {
          id: "sub_1",
          stripeSubscriptionId: "sub_1234567890",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          userName: "Juan Pérez",
          assistantId: "guardia-civil",
          assistantName: "Guardia Civil",
          status: "active",
          currentPeriodStart: "2024-01-15T10:30:00Z",
          currentPeriodEnd: "2024-02-15T10:30:00Z",
          cancelAtPeriodEnd: false,
          planType: "founder",
          amount: 1800,
          currency: "EUR",
          interval: "month",
          createdAt: "2024-01-15T10:30:00Z",
          lastPaymentDate: "2024-01-15T10:30:00Z",
          nextBillingDate: "2024-02-15T10:30:00Z",
          failedPaymentCount: 0,
        },
        {
          id: "sub_2",
          userId: "user3",
          userEmail: "pedro@ejemplo.com",
          userName: "Pedro López",
          assistantId: "mir",
          assistantName: "MIR",
          status: "past_due",
          currentPeriodStart: "2024-01-10T10:30:00Z",
          currentPeriodEnd: "2024-02-10T10:30:00Z",
          cancelAtPeriodEnd: false,
          planType: "normal",
          amount: 6600,
          currency: "EUR",
          interval: "month",
          createdAt: "2024-01-10T10:30:00Z",
          lastPaymentDate: "2024-01-10T10:30:00Z",
          nextBillingDate: "2024-02-10T10:30:00Z",
          failedPaymentCount: 2,
        },
      ];

      const mockInvoices: Invoice[] = [
        {
          id: "inv_001",
          invoiceNumber: "INV-2024-001",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          userName: "Juan Pérez",
          amount: 2178,
          subtotal: 1800,
          tax: 378,
          taxRate: 21,
          currency: "EUR",
          status: "paid",
          issueDate: "2024-01-15",
          dueDate: "2024-02-14",
          paidDate: "2024-01-15",
          description: "Suscripción mensual Guardia Civil",
          paymentTerms: "30 días",
          items: [
            {
              id: "item_1",
              description: "Guardia Civil - Plan Fundador Mensual",
              quantity: 1,
              unitPrice: 1800,
              total: 1800,
              assistantId: "guardia-civil",
              period: "Enero 2024",
            },
          ],
        },
      ];

      const mockRefunds: RefundRequest[] = [
        {
          id: "ref_1",
          paymentId: "pay_1",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          amount: 1800,
          reason: "Cliente no satisfecho con el servicio",
          status: "pending",
          requestedAt: "2024-01-16T10:30:00Z",
        },
      ];

      setPayments(mockPayments);
      setSubscriptions(mockSubscriptions);
      setInvoices(mockInvoices);
      setRefundRequests(mockRefunds);
    } catch (error) {
      console.error("Error loading payment data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de pagos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createManualPayment = async () => {
    try {
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        userId: `user_${Date.now()}`,
        userEmail: paymentForm.userEmail,
        userName: paymentForm.userEmail.split("@")[0],
        assistantId: paymentForm.assistantId || undefined,
        assistantName: paymentForm.assistantId ? `Asistente ${paymentForm.assistantId}` : undefined,
        academiaId: paymentForm.academiaId || undefined,
        academiaName: paymentForm.academiaId ? `Academia ${paymentForm.academiaId}` : undefined,
        amount: Math.round(paymentForm.amount * 100), // Convertir a centavos
        currency: "EUR",
        status: "completed",
        paymentMethod: paymentForm.paymentMethod,
        isManual: true,
        description: paymentForm.description,
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        notes: paymentForm.notes,
        metadata: {
          period: paymentForm.period,
          planType: paymentForm.planType,
        },
      };

      setPayments([newPayment, ...payments]);
      setShowCreatePaymentDialog(false);
      
      // Reset form
      setPaymentForm({
        userEmail: "",
        assistantId: "",
        academiaId: "",
        amount: 0,
        description: "",
        paymentMethod: "manual",
        planType: "normal",
        period: "monthly",
        notes: "",
      });

      toast({
        title: "Pago creado",
        description: "El pago manual se ha registrado correctamente",
      });
    } catch (error) {
      console.error("Error creating manual payment:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el pago manual",
        variant: "destructive",
      });
    }
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    try {
      // Simular generación de PDF
      const pdfData = {
        invoiceNumber: invoice.invoiceNumber,
        userName: invoice.userName,
        userEmail: invoice.userEmail,
        amount: invoice.amount,
        items: invoice.items,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      };

      // Aquí iría la lógica real de generación de PDF
      console.log("Generating PDF for invoice:", pdfData);

      toast({
        title: "PDF generado",
        description: `La factura ${invoice.invoiceNumber} se ha generado como PDF`,
      });
      
      // Simular descarga
      const blob = new Blob(["PDF content would be here"], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  const processRefund = async (refundId: string, approved: boolean) => {
    try {
      setRefundRequests(
        refundRequests.map((r) =>
          r.id === refundId
            ? {
                ...r,
                status: approved ? "approved" : "rejected",
                processedAt: new Date().toISOString(),
                processedBy: "admin@opositia.com",
                notes: refundForm.notes,
              }
            : r
        )
      );

      toast({
        title: approved ? "Reembolso aprobado" : "Reembolso rechazado",
        description: `El reembolso se ha ${approved ? "aprobado" : "rechazado"} correctamente`,
      });
      
      setShowRefundDialog(false);
    } catch (error) {
      console.error("Error processing refund:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el reembolso",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      setSubscriptions(
        subscriptions.map((s) =>
          s.id === subscriptionId
            ? {
                ...s,
                status: "canceled",
                cancelAtPeriodEnd: true,
                canceledAt: new Date().toISOString(),
              }
            : s
        )
      );

      toast({
        title: "Suscripción cancelada",
        description: "La suscripción se cancelará al final del período actual",
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la suscripción",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Payment["status"] | Subscription["status"] | Invoice["status"]) => {
    const configs = {
      completed: { color: "bg-green-600", text: "Completado" },
      paid: { color: "bg-green-600", text: "Pagado" },
      active: { color: "bg-green-600", text: "Activa" },
      pending: { color: "bg-yellow-600", text: "Pendiente" },
      draft: { color: "bg-gray-600", text: "Borrador" },
      sent: { color: "bg-blue-600", text: "Enviada" },
      failed: { color: "bg-red-600", text: "Fallido" },
      refunded: { color: "bg-purple-600", text: "Reembolsado" },
      disputed: { color: "bg-orange-600", text: "Disputado" },
      canceled: { color: "bg-red-600", text: "Cancelada" },
      past_due: { color: "bg-orange-600", text: "Vencida" },
      unpaid: { color: "bg-red-600", text: "No pagada" },
      trialing: { color: "bg-blue-600", text: "Prueba" },
      overdue: { color: "bg-red-600", text: "Vencida" },
    };

    const config = configs[status as keyof typeof configs] || { color: "bg-gray-600", text: status };
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getPaymentMethodIcon = (method: Payment["paymentMethod"]) => {
    const icons = {
      stripe: CreditCard,
      paypal: Wallet,
      bank_transfer: Building,
      manual: Edit,
    };
    const Icon = icons[method];
    return <Icon className="w-4 h-4" />;
  };

  const formatAmount = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
    }).format(amount / 100);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterPaymentMethod === "all" || payment.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const filteredSubscriptions = subscriptions.filter((sub) =>
    searchTerm === "" ||
    sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.assistantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter((inv) =>
    searchTerm === "" ||
    inv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const stats = {
    totalRevenue: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    monthlyRevenue: payments
      .filter((p) => p.status === "completed" && new Date(p.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0),
    activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    failedPayments: payments.filter((p) => p.status === "failed").length,
    refundRequests: refundRequests.filter((r) => r.status === "pending").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-400" />
              Gestión de Pagos y Facturación
            </h1>
            <p className="text-slate-400 mt-1">
              Control completo de pagos, suscripciones, facturas y reembolsos
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadPaymentData}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => setShowCreatePaymentDialog(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Pago
            </Button>
            <Button
              onClick={() => setShowCreateInvoiceDialog(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Ingresos Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {formatAmount(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {formatAmount(stats.monthlyRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Suscripciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.pendingPayments}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Fallidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.failedPayments}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">Reembolsos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.refundRequests}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <RefreshCw className="w-4 h-4 mr-2" />
              Suscripciones
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="w-4 h-4 mr-2" />
              Facturas
            </TabsTrigger>
            <TabsTrigger value="refunds">
              <Calculator className="w-4 h-4 mr-2" />
              Reembolsos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            {/* Filtros */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar pagos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="completed">Completados</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="failed">Fallidos</SelectItem>
                      <SelectItem value="refunded">Reembolsados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Transferencia</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Pagos */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">ID / Usuario</TableHead>
                      <TableHead className="text-white">Concepto</TableHead>
                      <TableHead className="text-white">Método</TableHead>
                      <TableHead className="text-white">Importe</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div className="font-mono text-sm">{payment.id}</div>
                            <div>{payment.userName}</div>
                            <div className="text-sm text-slate-400">{payment.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div>{payment.description}</div>
                            {payment.assistantName && (
                              <div className="text-sm text-slate-400">{payment.assistantName}</div>
                            )}
                            {payment.academiaName && (
                              <div className="text-sm text-slate-400">{payment.academiaName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-white capitalize">{payment.paymentMethod}</span>
                            {payment.isManual && (
                              <Badge className="bg-orange-600 text-white">Manual</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentDetailsDialog(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {payment.status === "completed" && (
                              <Button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowRefundDialog(true);
                                }}
                                size="sm"
                                className="bg-purple-500 hover:bg-purple-600"
                              >
                                <Calculator className="w-4 h-4" />
                              </Button>
                            )}
                            {payment.invoiceId && (
                              <Button
                                onClick={() => {
                                  const invoice = invoices.find((inv) => inv.id === payment.invoiceId);
                                  if (invoice) generateInvoicePDF(invoice);
                                }}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Usuario</TableHead>
                      <TableHead className="text-white">Asistente</TableHead>
                      <TableHead className="text-white">Plan</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Próximo Pago</TableHead>
                      <TableHead className="text-white">Fallos</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div>{subscription.userName}</div>
                            <div className="text-sm text-slate-400">{subscription.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{subscription.assistantName}</TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div>{formatAmount(subscription.amount)} / {subscription.interval === "month" ? "mes" : "año"}</div>
                            <Badge className={subscription.planType === "founder" ? "bg-yellow-600" : "bg-blue-600"}>
                              {subscription.planType === "founder" ? "Fundador" : "Normal"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {subscription.nextBillingDate
                            ? new Date(subscription.nextBillingDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {subscription.failedPaymentCount > 0 ? (
                            <Badge className="bg-red-600 text-white">
                              {subscription.failedPaymentCount} fallos
                            </Badge>
                          ) : (
                            <Badge className="bg-green-600 text-white">Sin fallos</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setSelectedSubscription(subscription)}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {subscription.status === "active" && (
                              <Button
                                onClick={() => cancelSubscription(subscription.id)}
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Número</TableHead>
                      <TableHead className="text-white">Cliente</TableHead>
                      <TableHead className="text-white">Importe</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Vencimiento</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white font-mono">{invoice.invoiceNumber}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            <div>{invoice.userName}</div>
                            <div className="text-sm text-slate-400">{invoice.userEmail}</div>
                            {invoice.academiaName && (
                              <div className="text-sm text-slate-400">{invoice.academiaName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatAmount(invoice.amount, invoice.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => generateInvoicePDF(invoice)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Usuario</TableHead>
                      <TableHead className="text-white">Pago ID</TableHead>
                      <TableHead className="text-white">Importe</TableHead>
                      <TableHead className="text-white">Motivo</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundRequests.map((refund) => (
                      <TableRow key={refund.id} className="border-slate-700">
                        <TableCell className="text-white">{refund.userEmail}</TableCell>
                        <TableCell className="text-white font-mono">{refund.paymentId}</TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatAmount(refund.amount)}
                        </TableCell>
                        <TableCell className="text-white max-w-xs truncate">
                          {refund.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(refund.status as any)}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(refund.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {refund.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => processRefund(refund.id, true)}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => processRefund(refund.id, false)}
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear pago manual */}
        <Dialog open={showCreatePaymentDialog} onOpenChange={setShowCreatePaymentDialog}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Pago Manual</DialogTitle>
              <DialogDescription className="text-slate-400">
                Registra un pago recibido por otros medios (transferencia, efectivo, etc.)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email del Usuario *</Label>
                  <Input
                    value={paymentForm.userEmail}
                    onChange={(e) => setPaymentForm({ ...paymentForm, userEmail: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Importe (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="18.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Asistente (opcional)</Label>
                  <Select
                    value={paymentForm.assistantId}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, assistantId: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar asistente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asistente</SelectItem>
                      <SelectItem value="guardia-civil">Guardia Civil</SelectItem>
                      <SelectItem value="mir">MIR</SelectItem>
                      <SelectItem value="policia-nacional">Policía Nacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Academia (opcional)</Label>
                  <Input
                    value={paymentForm.academiaId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, academiaId: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="ID de academia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Método de Pago</Label>
                  <Select
                    value={paymentForm.paymentMethod}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="bank_transfer">Transferencia</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Tipo de Plan</Label>
                  <Select
                    value={paymentForm.planType}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, planType: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="founder">Fundador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Período</Label>
                  <Select
                    value={paymentForm.period}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, period: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Descripción *</Label>
                <Input
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Concepto del pago"
                />
              </div>

              <div>
                <Label className="text-white">Notas Internas</Label>
                <Textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Información adicional sobre el pago..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowCreatePaymentDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={createManualPayment}
                className="bg-blue-500 hover:bg-blue-600"
                disabled={!paymentForm.userEmail || !paymentForm.amount || !paymentForm.description}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Pago
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para detalles de pago */}
        <Dialog open={showPaymentDetailsDialog} onOpenChange={setShowPaymentDetailsDialog}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Detalles del Pago #{selectedPayment?.id}
              </DialogTitle>
            </DialogHeader>
            
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Usuario</Label>
                    <div className="text-white">
                      <div>{selectedPayment.userName}</div>
                      <div className="text-sm text-slate-400">{selectedPayment.userEmail}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400">Importe</Label>
                    <div className="text-white font-semibold text-lg">
                      {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Estado</Label>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div>
                    <Label className="text-slate-400">Método de Pago</Label>
                    <div className="flex items-center gap-2 text-white">
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      {selectedPayment.paymentMethod}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400">Descripción</Label>
                  <div className="text-white">{selectedPayment.description}</div>
                </div>

                {selectedPayment.assistantName && (
                  <div>
                    <Label className="text-slate-400">Asistente</Label>
                    <div className="text-white">{selectedPayment.assistantName}</div>
                  </div>
                )}

                {selectedPayment.notes && (
                  <div>
                    <Label className="text-slate-400">Notas</Label>
                    <div className="text-white">{selectedPayment.notes}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Fecha de Creación</Label>
                    <div className="text-white">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {selectedPayment.paidAt && (
                    <div>
                      <Label className="text-slate-400">Fecha de Pago</Label>
                      <div className="text-white">
                        {new Date(selectedPayment.paidAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {selectedPayment.stripePaymentId && (
                  <div>
                    <Label className="text-slate-400">ID de Stripe</Label>
                    <div className="text-white font-mono text-sm">
                      {selectedPayment.stripePaymentId}
                    </div>
                  </div>
                )}

                <div className="bg-slate-700 p-3 rounded-lg">
                  <Label className="text-slate-400">Metadatos</Label>
                  <div className="text-white text-sm mt-1">
                    <div>Período: {selectedPayment.metadata.period}</div>
                    <div>Tipo de Plan: {selectedPayment.metadata.planType}</div>
                    {selectedPayment.metadata.discountCode && (
                      <div>Código de Descuento: {selectedPayment.metadata.discountCode}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
