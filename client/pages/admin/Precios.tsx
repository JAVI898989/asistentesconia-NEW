import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import {
  Euro,
  Settings,
  Edit,
  Save,
  RefreshCw,
  TrendingUp,
  Percent,
  Gift,
  Users,
  Calendar,
  Tag,
  DollarSign,
  CreditCard,
  Crown,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssistantPricing {
  id: string;
  name: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced" | "expert";
  founderPrice: {
    monthly: number;
    annual: number;
  };
  normalPrice: {
    monthly: number;
    annual: number;
  };
  isFounderActive: boolean;
  founderSlotsTotal: number;
  founderSlotsUsed: number;
  customPricing: boolean;
}

interface GlobalPricing {
  basic: { founder: number; normal: number };
  intermediate: { founder: number; normal: number };
  advanced: { founder: number; normal: number };
  expert: { founder: number; normal: number };
  public: { founder: number; normal: number };
}

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount?: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableAssistants: string[];
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: "stripe" | "paypal" | "bank_transfer" | "crypto";
  isActive: boolean;
  processingFee: number;
  currency: string;
  config: any;
}

export default function Precios() {
  const [assistantPricing, setAssistantPricing] = useState<AssistantPricing[]>([]);
  const [globalPricing, setGlobalPricing] = useState<GlobalPricing>({
    basic: { founder: 16, normal: 48 },
    intermediate: { founder: 18, normal: 54 },
    advanced: { founder: 20, normal: 60 },
    expert: { founder: 22, normal: 66 },
    public: { founder: 10, normal: 30 },
  });
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAssistant, setEditingAssistant] = useState<AssistantPricing | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("assistants");
  const { toast } = useToast();

  // Form para nuevo descuento
  const [discountForm, setDiscountForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minAmount: 0,
    maxUses: 100,
    validFrom: "",
    validUntil: "",
    description: "",
    applicableAssistants: [] as string[],
  });

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      // Simular carga de datos - reemplazar con Firebase
      const mockAssistants: AssistantPricing[] = [
        {
          id: "guardia-civil",
          name: "Guardia Civil",
          category: "seguridad",
          difficulty: "intermediate",
          founderPrice: { monthly: 18, annual: 180 },
          normalPrice: { monthly: 54, annual: 540 },
          isFounderActive: true,
          founderSlotsTotal: 150,
          founderSlotsUsed: 147,
          customPricing: false,
        },
        {
          id: "mir",
          name: "Médico Interno Residente (MIR)",
          category: "sanidad",
          difficulty: "expert",
          founderPrice: { monthly: 22, annual: 220 },
          normalPrice: { monthly: 66, annual: 660 },
          isFounderActive: false,
          founderSlotsTotal: 100,
          founderSlotsUsed: 100,
          customPricing: false,
        },
        {
          id: "inspeccion-hacienda",
          name: "Inspección de Hacienda",
          category: "hacienda",
          difficulty: "expert",
          founderPrice: { monthly: 35, annual: 350 },
          normalPrice: { monthly: 105, annual: 1050 },
          isFounderActive: false,
          founderSlotsTotal: 30,
          founderSlotsUsed: 30,
          customPricing: true,
        },
      ];

      const mockDiscounts: DiscountCode[] = [
        {
          id: "1",
          code: "NEWYEAR2024",
          type: "percentage",
          value: 25,
          minAmount: 50,
          maxUses: 500,
          currentUses: 147,
          validFrom: "2024-01-01",
          validUntil: "2024-02-01",
          isActive: true,
          applicableAssistants: [],
          description: "Descuento Año Nuevo 25%",
        },
        {
          id: "2",
          code: "FUNDADOR10",
          type: "fixed",
          value: 10,
          maxUses: 1000,
          currentUses: 234,
          validFrom: "2024-01-01",
          validUntil: "2024-12-31",
          isActive: true,
          applicableAssistants: ["guardia-civil", "mir"],
          description: "Descuento fijo fundadores",
        },
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "stripe",
          name: "Stripe (Tarjetas)",
          type: "stripe",
          isActive: true,
          processingFee: 2.9,
          currency: "EUR",
          config: {},
        },
        {
          id: "paypal",
          name: "PayPal",
          type: "paypal",
          isActive: true,
          processingFee: 3.4,
          currency: "EUR",
          config: {},
        },
        {
          id: "transfer",
          name: "Transferencia Bancaria",
          type: "bank_transfer",
          isActive: false,
          processingFee: 0,
          currency: "EUR",
          config: {},
        },
      ];

      setAssistantPricing(mockAssistants);
      setDiscountCodes(mockDiscounts);
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error("Error loading pricing data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de precios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalPricing = async () => {
    try {
      // Actualizar todos los asistentes que no tienen precio personalizado
      const updatedAssistants = assistantPricing.map((assistant) => {
        if (!assistant.customPricing) {
          const pricing = globalPricing[assistant.difficulty];
          return {
            ...assistant,
            founderPrice: {
              monthly: pricing.founder,
              annual: pricing.founder * 10,
            },
            normalPrice: {
              monthly: pricing.normal,
              annual: pricing.normal * 10,
            },
          };
        }
        return assistant;
      });

      setAssistantPricing(updatedAssistants);

      toast({
        title: "Precios actualizados",
        description: "Los precios globales se han aplicado correctamente",
      });
    } catch (error) {
      console.error("Error updating global pricing:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los precios",
        variant: "destructive",
      });
    }
  };

  const updateAssistantPricing = async () => {
    if (!editingAssistant) return;

    try {
      setAssistantPricing(
        assistantPricing.map((a) =>
          a.id === editingAssistant.id ? editingAssistant : a
        )
      );
      setShowEditDialog(false);
      setEditingAssistant(null);

      toast({
        title: "Precio actualizado",
        description: `Los precios de ${editingAssistant.name} se han actualizado`,
      });
    } catch (error) {
      console.error("Error updating assistant pricing:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio",
        variant: "destructive",
      });
    }
  };

  const createDiscountCode = async () => {
    try {
      const newDiscount: DiscountCode = {
        id: Date.now().toString(),
        ...discountForm,
        currentUses: 0,
        isActive: true,
      };

      setDiscountCodes([...discountCodes, newDiscount]);
      setShowDiscountDialog(false);
      setDiscountForm({
        code: "",
        type: "percentage",
        value: 0,
        minAmount: 0,
        maxUses: 100,
        validFrom: "",
        validUntil: "",
        description: "",
        applicableAssistants: [],
      });

      toast({
        title: "Código creado",
        description: "El código de descuento se ha creado correctamente",
      });
    } catch (error) {
      console.error("Error creating discount code:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el código de descuento",
        variant: "destructive",
      });
    }
  };

  const toggleDiscountCode = async (discountId: string) => {
    try {
      setDiscountCodes(
        discountCodes.map((d) =>
          d.id === discountId ? { ...d, isActive: !d.isActive } : d
        )
      );

      toast({
        title: "Estado actualizado",
        description: "El estado del código de descuento se ha actualizado",
      });
    } catch (error) {
      console.error("Error toggling discount code:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: AssistantPricing["difficulty"]) => {
    const colors = {
      basic: "bg-green-600",
      intermediate: "bg-blue-600",
      advanced: "bg-orange-600",
      expert: "bg-red-600",
    };
    return colors[difficulty];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Euro className="w-8 h-8 text-green-400" />
              Gestión Avanzada de Precios
            </h1>
            <p className="text-slate-400 mt-1">
              Control total sobre precios, descuentos y métodos de pago
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadPricingData}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={updateGlobalPricing}
              className="bg-green-500 hover:bg-green-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Aplicar Precios Globales
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="assistants">
              <DollarSign className="w-4 h-4 mr-2" />
              Precios por Asistente
            </TabsTrigger>
            <TabsTrigger value="global">
              <Settings className="w-4 h-4 mr-2" />
              Precios Globales
            </TabsTrigger>
            <TabsTrigger value="discounts">
              <Gift className="w-4 h-4 mr-2" />
              Códigos de Descuento
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Métodos de Pago
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistants" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Precios Individuales por Asistente</CardTitle>
                <CardDescription className="text-slate-400">
                  Configura precios específicos para cada asistente
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Asistente</TableHead>
                      <TableHead className="text-white">Dificultad</TableHead>
                      <TableHead className="text-white">Precio Fundador</TableHead>
                      <TableHead className="text-white">Precio Normal</TableHead>
                      <TableHead className="text-white">Fundadores</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assistantPricing.map((assistant) => (
                      <TableRow key={assistant.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div>{assistant.name}</div>
                            <div className="text-sm text-slate-400">{assistant.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getDifficultyColor(assistant.difficulty)} text-white`}>
                            {assistant.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>€{assistant.founderPrice.monthly}/mes</div>
                          <div className="text-sm text-slate-400">
                            €{assistant.founderPrice.annual}/año
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>€{assistant.normalPrice.monthly}/mes</div>
                          <div className="text-sm text-slate-400">
                            €{assistant.normalPrice.annual}/año
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">
                            {assistant.founderSlotsUsed}/{assistant.founderSlotsTotal}
                          </div>
                          <div className="text-sm text-slate-400">
                            {assistant.founderSlotsTotal - assistant.founderSlotsUsed} disponibles
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {assistant.isFounderActive ? (
                              <Badge className="bg-yellow-600 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Fundador Activo
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-600 text-white">Fundador Cerrado</Badge>
                            )}
                            {assistant.customPricing && (
                              <Badge className="bg-purple-600 text-white">
                                <Tag className="w-3 h-3 mr-1" />
                                Precio Custom
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setEditingAssistant(assistant);
                              setShowEditDialog(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configuración de Precios Globales</CardTitle>
                <CardDescription className="text-slate-400">
                  Establece los precios base por nivel de dificultad. Se aplicarán a todos los asistentes que no tengan precio personalizado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(globalPricing).map(([difficulty, pricing]) => (
                  <div key={difficulty} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDifficultyColor(difficulty as any)} text-white`}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-white">Precio Fundador (€/mes)</Label>
                      <Input
                        type="number"
                        value={pricing.founder}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            [difficulty]: {
                              ...pricing,
                              founder: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Precio Normal (€/mes)</Label>
                      <Input
                        type="number"
                        value={pricing.normal}
                        onChange={(e) =>
                          setGlobalPricing({
                            ...globalPricing,
                            [difficulty]: {
                              ...pricing,
                              normal: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    onClick={updateGlobalPricing}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Precios Globales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Códigos de Descuento</h2>
              <Button
                onClick={() => setShowDiscountDialog(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Gift className="w-4 h-4 mr-2" />
                Crear Código
              </Button>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white">Código</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                      <TableHead className="text-white">Valor</TableHead>
                      <TableHead className="text-white">Usos</TableHead>
                      <TableHead className="text-white">Válido hasta</TableHead>
                      <TableHead className="text-white">Estado</TableHead>
                      <TableHead className="text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountCodes.map((discount) => (
                      <TableRow key={discount.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white">
                            <div className="font-mono">{discount.code}</div>
                            <div className="text-sm text-slate-400">{discount.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={discount.type === "percentage" ? "bg-blue-600" : "bg-green-600"}>
                            {discount.type === "percentage" ? "Porcentaje" : "Fijo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {discount.type === "percentage" ? `${discount.value}%` : `€${discount.value}`}
                        </TableCell>
                        <TableCell className="text-white">
                          {discount.currentUses}
                          {discount.maxUses && `/${discount.maxUses}`}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(discount.validUntil).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {discount.isActive ? (
                            <Badge className="bg-green-600 text-white">Activo</Badge>
                          ) : (
                            <Badge className="bg-red-600 text-white">Inactivo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Switch
                              checked={discount.isActive}
                              onCheckedChange={() => toggleDiscountCode(discount.id)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4" />
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

          <TabsContent value="payments" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Métodos de Pago Disponibles</CardTitle>
                <CardDescription className="text-slate-400">
                  Configura los métodos de pago disponibles para los usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-white">
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-slate-400">
                          Comisión: {method.processingFee}% • Moneda: {method.currency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {method.isActive ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                      <Switch checked={method.isActive} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para editar precio de asistente */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Editar Precios - {editingAssistant?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Configura precios específicos para este asistente
              </DialogDescription>
            </DialogHeader>

            {editingAssistant && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingAssistant.customPricing}
                    onCheckedChange={(checked) =>
                      setEditingAssistant({ ...editingAssistant, customPricing: checked })
                    }
                  />
                  <Label className="text-white">Usar precio personalizado</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Precio Fundador Mensual (€)</Label>
                    <Input
                      type="number"
                      value={editingAssistant.founderPrice.monthly}
                      onChange={(e) =>
                        setEditingAssistant({
                          ...editingAssistant,
                          founderPrice: {
                            ...editingAssistant.founderPrice,
                            monthly: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Precio Fundador Anual (€)</Label>
                    <Input
                      type="number"
                      value={editingAssistant.founderPrice.annual}
                      onChange={(e) =>
                        setEditingAssistant({
                          ...editingAssistant,
                          founderPrice: {
                            ...editingAssistant.founderPrice,
                            annual: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Precio Normal Mensual (€)</Label>
                    <Input
                      type="number"
                      value={editingAssistant.normalPrice.monthly}
                      onChange={(e) =>
                        setEditingAssistant({
                          ...editingAssistant,
                          normalPrice: {
                            ...editingAssistant.normalPrice,
                            monthly: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Precio Normal Anual (€)</Label>
                    <Input
                      type="number"
                      value={editingAssistant.normalPrice.annual}
                      onChange={(e) =>
                        setEditingAssistant({
                          ...editingAssistant,
                          normalPrice: {
                            ...editingAssistant.normalPrice,
                            annual: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Plazas Fundador Total</Label>
                    <Input
                      type="number"
                      value={editingAssistant.founderSlotsTotal}
                      onChange={(e) =>
                        setEditingAssistant({
                          ...editingAssistant,
                          founderSlotsTotal: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Switch
                      checked={editingAssistant.isFounderActive}
                      onCheckedChange={(checked) =>
                        setEditingAssistant({ ...editingAssistant, isFounderActive: checked })
                      }
                    />
                    <Label className="text-white">Fundador Activo</Label>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setShowEditDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={updateAssistantPricing} className="bg-green-500 hover:bg-green-600">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear código de descuento */}
        <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Código de Descuento</DialogTitle>
              <DialogDescription className="text-slate-400">
                Crea un nuevo código de descuento para los usuarios
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Código</Label>
                  <Input
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                    className="bg-slate-700 border-slate-600 text-white font-mono"
                    placeholder="CODIGO2024"
                  />
                </div>
                <div>
                  <Label className="text-white">Tipo</Label>
                  <Select
                    value={discountForm.type}
                    onValueChange={(value) => setDiscountForm({ ...discountForm, type: value as any })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Cantidad Fija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">
                    Valor {discountForm.type === "percentage" ? "(%)" : "(€)"}
                  </Label>
                  <Input
                    type="number"
                    value={discountForm.value}
                    onChange={(e) => setDiscountForm({ ...discountForm, value: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Importe Mínimo (€)</Label>
                  <Input
                    type="number"
                    value={discountForm.minAmount}
                    onChange={(e) => setDiscountForm({ ...discountForm, minAmount: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Usos Máximos</Label>
                  <Input
                    type="number"
                    value={discountForm.maxUses}
                    onChange={(e) => setDiscountForm({ ...discountForm, maxUses: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Válido Desde</Label>
                  <Input
                    type="date"
                    value={discountForm.validFrom}
                    onChange={(e) => setDiscountForm({ ...discountForm, validFrom: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Válido Hasta</Label>
                  <Input
                    type="date"
                    value={discountForm.validUntil}
                    onChange={(e) => setDiscountForm({ ...discountForm, validUntil: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Descripción</Label>
                <Input
                  value={discountForm.description}
                  onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Descripción del descuento"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowDiscountDialog(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={createDiscountCode} className="bg-purple-500 hover:bg-purple-600">
                <Gift className="w-4 h-4 mr-2" />
                Crear Código
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
