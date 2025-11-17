import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  MessageSquare,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  User,
  CreditCard,
  Bot,
  Bug,
  HelpCircle,
  Zap,
  Calendar,
  MessageCircle,
  Edit,
  Trash2,
  Send,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  category: "payment" | "technical" | "assistant" | "account" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_user" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: TicketResponse[];
  errorDetails?: {
    type: "stripe" | "firebase" | "openai" | "general";
    message: string;
    stackTrace?: string;
    timestamp: string;
  };
}

interface TicketResponse {
  id: string;
  author: string;
  authorType: "admin" | "user";
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface ErrorLog {
  id: string;
  userId: string;
  userEmail: string;
  type: "stripe_error" | "firebase_error" | "openai_error" | "general_error";
  message: string;
  details: any;
  timestamp: string;
  resolved: boolean;
  ticketId?: string;
}

export default function Soporte() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const { toast } = useToast();

  // Form para nuevo ticket
  const [ticketForm, setTicketForm] = useState({
    userEmail: "",
    subject: "",
    description: "",
    category: "other" as SupportTicket["category"],
    priority: "medium" as SupportTicket["priority"],
  });

  useEffect(() => {
    loadTickets();
    loadErrorLogs();
  }, []);

  const loadTickets = async () => {
    try {
      // Simular carga de tickets - reemplazar con Firebase
      const mockTickets: SupportTicket[] = [
        {
          id: "1",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          userName: "Juan Pérez",
          subject: "Error al procesar pago",
          description: "Mi pago no se procesa correctamente en Stripe",
          category: "payment",
          priority: "high",
          status: "open",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
          responses: [],
          errorDetails: {
            type: "stripe",
            message: "Payment failed: insufficient_funds",
            timestamp: "2024-01-15T10:30:00Z",
          },
        },
        {
          id: "2",
          userId: "user2",
          userEmail: "maria@ejemplo.com",
          userName: "María García",
          subject: "Asistente no responde",
          description: "El asistente de Guardia Civil no está funcionando",
          category: "assistant",
          priority: "medium",
          status: "in_progress",
          createdAt: "2024-01-14T15:20:00Z",
          updatedAt: "2024-01-15T09:15:00Z",
          assignedTo: "admin@opositia.com",
          responses: [
            {
              id: "r1",
              author: "admin@opositia.com",
              authorType: "admin",
              content: "Estamos revisando el problema. Parece ser un issue con OpenAI.",
              timestamp: "2024-01-15T09:15:00Z",
              isInternal: false,
            },
          ],
        },
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadErrorLogs = async () => {
    try {
      // Simular carga de logs de errores - reemplazar con Firebase
      const mockLogs: ErrorLog[] = [
        {
          id: "e1",
          userId: "user1",
          userEmail: "usuario@ejemplo.com",
          type: "stripe_error",
          message: "Payment failed",
          details: { error_code: "insufficient_funds", amount: 1800 },
          timestamp: "2024-01-15T10:30:00Z",
          resolved: false,
          ticketId: "1",
        },
        {
          id: "e2",
          userId: "user3",
          userEmail: "pedro@ejemplo.com",
          type: "openai_error",
          message: "API request timeout",
          details: { timeout: 30000, assistant: "guardia-civil" },
          timestamp: "2024-01-15T08:45:00Z",
          resolved: true,
        },
      ];
      setErrorLogs(mockLogs);
    } catch (error) {
      console.error("Error loading error logs:", error);
    }
  };

  const createTicket = async () => {
    try {
      const newTicket: SupportTicket = {
        id: Date.now().toString(),
        userId: "manual",
        userEmail: ticketForm.userEmail,
        userName: ticketForm.userEmail.split("@")[0],
        subject: ticketForm.subject,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: [],
      };

      setTickets([newTicket, ...tickets]);
      setShowCreateDialog(false);
      setTicketForm({
        userEmail: "",
        subject: "",
        description: "",
        category: "other",
        priority: "medium",
      });

      toast({
        title: "Ticket creado",
        description: "El ticket se ha creado correctamente",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      });
    }
  };

  const addResponse = async () => {
    if (!selectedTicket || !newResponse.trim()) return;

    try {
      const response: TicketResponse = {
        id: Date.now().toString(),
        author: "admin@opositia.com",
        authorType: "admin",
        content: newResponse,
        timestamp: new Date().toISOString(),
        isInternal: false,
      };

      const updatedTicket = {
        ...selectedTicket,
        responses: [...selectedTicket.responses, response],
        status: "waiting_user" as const,
        updatedAt: new Date().toISOString(),
      };

      setTickets(
        tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t))
      );
      setSelectedTicket(updatedTicket);
      setNewResponse("");

      toast({
        title: "Respuesta enviada",
        description: "La respuesta se ha enviado al usuario",
      });
    } catch (error) {
      console.error("Error adding response:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket["status"]) => {
    try {
      setTickets(
        tickets.map((t) =>
          t.id === ticketId
            ? { ...t, status, updatedAt: new Date().toISOString() }
            : t
        )
      );

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }

      toast({
        title: "Estado actualizado",
        description: `El ticket se ha marcado como ${status}`,
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    const config = {
      open: { color: "bg-red-500", icon: AlertTriangle, text: "Abierto" },
      in_progress: { color: "bg-blue-500", icon: Clock, text: "En progreso" },
      waiting_user: { color: "bg-yellow-500", icon: MessageCircle, text: "Esperando usuario" },
      resolved: { color: "bg-green-500", icon: CheckCircle, text: "Resuelto" },
      closed: { color: "bg-gray-500", icon: CheckCircle, text: "Cerrado" },
    };

    const { color, text } = config[status];
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getPriorityBadge = (priority: SupportTicket["priority"]) => {
    const colors = {
      low: "bg-green-600",
      medium: "bg-yellow-600",
      high: "bg-orange-600",
      urgent: "bg-red-600",
    };
    return (
      <Badge className={`${colors[priority]} text-white`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: SupportTicket["category"]) => {
    const icons = {
      payment: CreditCard,
      technical: Bug,
      assistant: Bot,
      account: User,
      other: HelpCircle,
    };
    const Icon = icons[category];
    return <Icon className="w-4 h-4" />;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory;
    const matchesSearch =
      searchTerm === "" ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const filteredErrorLogs = errorLogs.filter((log) =>
    searchTerm === "" ||
    log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-400" />
              Centro de Soporte Técnico
            </h1>
            <p className="text-slate-400 mt-1">
              Gestión completa de incidencias, tickets y errores del sistema
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Ticket
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="tickets">
              <MessageSquare className="w-4 h-4 mr-2" />
              Tickets de Soporte
            </TabsTrigger>
            <TabsTrigger value="errors">
              <Bug className="w-4 h-4 mr-2" />
              Logs de Errores
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Zap className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {/* Filtros */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <Label className="text-white">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por email o asunto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Estado</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="open">Abiertos</SelectItem>
                        <SelectItem value="in_progress">En progreso</SelectItem>
                        <SelectItem value="waiting_user">Esperando usuario</SelectItem>
                        <SelectItem value="resolved">Resueltos</SelectItem>
                        <SelectItem value="closed">Cerrados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Categoría</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="payment">Pagos</SelectItem>
                        <SelectItem value="technical">Técnico</SelectItem>
                        <SelectItem value="assistant">Asistente</SelectItem>
                        <SelectItem value="account">Cuenta</SelectItem>
                        <SelectItem value="other">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={loadTickets}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Tickets */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Usuario</TableHead>
                      <TableHead className="text-white">Asunto</TableHead>
                      <TableHead className="text-white">Categoría</TableHead>
                      <TableHead className="text-white">Prioridad</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div>{ticket.userName}</div>
                            <div className="text-sm text-slate-400">{ticket.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{ticket.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(ticket.category)}
                            <span className="text-white capitalize">{ticket.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowTicketDialog(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select
                              value={ticket.status}
                              onValueChange={(status) =>
                                updateTicketStatus(ticket.id, status as SupportTicket["status"])
                              }
                            >
                              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Abierto</SelectItem>
                                <SelectItem value="in_progress">En progreso</SelectItem>
                                <SelectItem value="waiting_user">Esperando</SelectItem>
                                <SelectItem value="resolved">Resuelto</SelectItem>
                                <SelectItem value="closed">Cerrado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            {/* Logs de Errores */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Historial de Errores del Sistema</CardTitle>
                <CardDescription className="text-slate-400">
                  Errores automáticos reportados por Stripe, Firebase, OpenAI y otros servicios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Usuario</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                      <TableHead className="text-white">Mensaje</TableHead>
                      <TableHead className="text-white">Fecha</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Ticket</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredErrorLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700">
                        <TableCell className="text-white">{log.userEmail}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.type === "stripe_error"
                                ? "bg-purple-600"
                                : log.type === "firebase_error"
                                ? "bg-orange-600"
                                : log.type === "openai_error"
                                ? "bg-green-600"
                                : "bg-gray-600"
                            }
                          >
                            {log.type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white max-w-xs truncate">
                          {log.message}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {log.resolved ? (
                            <Badge className="bg-green-600">Resuelto</Badge>
                          ) : (
                            <Badge className="bg-red-600">Pendiente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.ticketId ? (
                            <Button size="sm" variant="outline" className="border-slate-600 text-white">
                              Ver Ticket
                            </Button>
                          ) : (
                            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                              Crear Ticket
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {/* Estadísticas de Soporte */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{tickets.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Abiertos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {tickets.filter((t) => t.status === "open").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">En Progreso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {tickets.filter((t) => t.status === "in_progress").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">Resueltos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {tickets.filter((t) => t.status === "resolved").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear ticket */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Ticket</DialogTitle>
              <DialogDescription className="text-slate-400">
                Crear un ticket manual de soporte
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Email del Usuario</Label>
                <Input
                  value={ticketForm.userEmail}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, userEmail: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <Label className="text-white">Asunto</Label>
                <Input
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe brevemente el problema"
                />
              </div>
              <div>
                <Label className="text-white">Categoría</Label>
                <Select
                  value={ticketForm.category}
                  onValueChange={(value) =>
                    setTicketForm({ ...ticketForm, category: value as SupportTicket["category"] })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Problemas de Pago</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="assistant">Asistente IA</SelectItem>
                    <SelectItem value="account">Cuenta</SelectItem>
                    <SelectItem value="other">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Prioridad</Label>
                <Select
                  value={ticketForm.priority}
                  onValueChange={(value) =>
                    setTicketForm({ ...ticketForm, priority: value as SupportTicket["priority"] })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Descripción</Label>
                <Textarea
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, description: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe detalladamente el problema..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowCreateDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={createTicket} className="bg-indigo-500 hover:bg-indigo-600">
                Crear Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para ver/responder ticket */}
        <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
          <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                #{selectedTicket?.id} - {selectedTicket?.subject}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Ticket de {selectedTicket?.userName} ({selectedTicket?.userEmail})
              </DialogDescription>
            </DialogHeader>

            {selectedTicket && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Información del ticket */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(selectedTicket.category)}
                        <span className="text-white">{selectedTicket.category}</span>
                        {getPriorityBadge(selectedTicket.priority)}
                        {getStatusBadge(selectedTicket.status)}
                      </div>
                      <p className="text-slate-400 text-sm">
                        Creado: {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-white">{selectedTicket.description}</p>

                  {selectedTicket.errorDetails && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded">
                      <h4 className="text-red-400 font-semibold mb-2">Detalles del Error</h4>
                      <p className="text-red-300 text-sm">Tipo: {selectedTicket.errorDetails.type}</p>
                      <p className="text-red-300 text-sm">Mensaje: {selectedTicket.errorDetails.message}</p>
                      <p className="text-red-300 text-sm">
                        Timestamp: {new Date(selectedTicket.errorDetails.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Respuestas */}
                <div className="space-y-3">
                  {selectedTicket.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg ${
                        response.authorType === "admin"
                          ? "bg-indigo-900/20 border-l-4 border-indigo-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">
                          {response.authorType === "admin" ? "👨‍💼 Admin" : "👤 Usuario"}: {response.author}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{response.content}</p>
                    </div>
                  ))}
                </div>

                {/* Nueva respuesta */}
                <div className="space-y-3">
                  <Label className="text-white">Responder al Usuario</Label>
                  <Textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                  />
                  <Button
                    onClick={addResponse}
                    className="bg-indigo-500 hover:bg-indigo-600"
                    disabled={!newResponse.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Respuesta
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
