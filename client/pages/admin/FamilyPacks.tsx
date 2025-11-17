import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  Save,
  RefreshCw,
  Users,
  Euro,
  Calendar,
  Crown,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getFamilyPackSettings,
  updateFamilyPackSettings,
  getFamilyPackCounter,
  initializeFamilyPackCounter,
  getDefaultFamilyPackSettings,
} from "@/lib/familyPackService";
import type { FamilyPackSettings, FamilyPackCounter } from "@/types/familyPack";

export default function FamilyPacks() {
  const [settings, setSettings] = useState<FamilyPackSettings | null>(null);
  const [counter, setCounter] = useState<FamilyPackCounter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, counterData] = await Promise.all([
        getFamilyPackSettings(),
        getFamilyPackCounter(),
      ]);

      // Initialize with defaults if no settings exist
      if (!settingsData) {
        const defaultSettings = getDefaultFamilyPackSettings();
        setSettings(defaultSettings);
        await updateFamilyPackSettings(defaultSettings);
      } else {
        setSettings(settingsData);
      }

      // Initialize counter if it doesn't exist
      if (!counterData) {
        await initializeFamilyPackCounter();
        setCounter({ limit: 200, sold: 0, updatedAtMs: Date.now() });
      } else {
        setCounter(counterData);
      }
    } catch (error) {
      console.error('Error loading family pack data:', error);
      toast.error('Error al cargar los datos de packs familiares');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await updateFamilyPackSettings(settings);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateTierPrice = (tier: '3' | '5' | '8', cycle: 'monthly' | 'annual', field: 'price' | 'priceId', value: string | number) => {
    if (!settings) return;

    setSettings({
      ...settings,
      tiers: {
        ...settings.tiers,
        [tier]: {
          ...settings.tiers[tier],
          [cycle]: {
            ...settings.tiers[tier][cycle],
            [field]: value,
          },
        },
      },
    });
  };

  const updateAddonPrice = (cycle: 'monthly' | 'annual', field: 'price' | 'priceId', value: string | number) => {
    if (!settings) return;

    setSettings({
      ...settings,
      addonPublic: {
        ...settings.addonPublic,
        [cycle]: {
          ...settings.addonPublic[cycle],
          [field]: value,
        },
      },
    });
  };

  const toggleTierFeatured = (tier: '3' | '5' | '8') => {
    if (!settings) return;

    setSettings({
      ...settings,
      tiers: {
        ...settings.tiers,
        [tier]: {
          ...settings.tiers[tier],
          featured: !settings.tiers[tier].featured,
        },
      },
    });
  };

  const remaining = counter ? counter.limit - counter.sold : 0;
  const soldPercentage = counter ? (counter.sold / counter.limit) * 100 : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-400" />
              Packs Familiares
            </h1>
            <p className="text-slate-400 mt-1">
              Gestión completa de paquetes familiares con facturación mensual y anual
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={saveSettings}
              disabled={saving || !settings}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        {counter && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Vendidos</p>
                    <p className="text-2xl font-bold text-white">{counter.sold}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Restantes</p>
                    <p className="text-2xl font-bold text-white">{remaining}</p>
                  </div>
                  <Package className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Límite Total</p>
                    <p className="text-2xl font-bold text-white">{counter.limit}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">% Completado</p>
                    <p className="text-2xl font-bold text-white">{Math.round(soldPercentage)}%</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    soldPercentage >= 90 ? 'bg-red-500' : soldPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {soldPercentage >= 90 ? (
                      <AlertTriangle className="w-4 h-4 text-white" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configuración General
            </TabsTrigger>
            <TabsTrigger value="tiers">
              <Package className="w-4 h-4 mr-2" />
              Tiers y Precios
            </TabsTrigger>
            <TabsTrigger value="addons">
              <Euro className="w-4 h-4 mr-2" />
              Add-ons
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="settings" className="space-y-6">
            {settings && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={settings.enabled}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, enabled: checked })
                          }
                        />
                        <Label className="text-white">Packs familiares habilitados</Label>
                      </div>

                      <div>
                        <Label className="text-white">Límite total de packs</Label>
                        <Input
                          type="number"
                          value={settings.limit}
                          onChange={(e) => 
                            setSettings({ ...settings, limit: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-white">Meses gratis en anual</Label>
                        <Input
                          type="number"
                          value={settings.annualDiscountMonths}
                          onChange={(e) => 
                            setSettings({ ...settings, annualDiscountMonths: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <p className="text-sm text-slate-400 mt-1">
                          Descuento aplicado automáticamente en precios anuales
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          <strong>Importante:</strong> Los cambios en límites y habilitación afectan 
                          inmediatamente a las nuevas compras. Los precios requieren configuración 
                          en Stripe antes de ser usados.
                        </AlertDescription>
                      </Alert>

                      {!settings.enabled && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            Los packs familiares están deshabilitados. Los usuarios no podrán 
                            realizar nuevas compras hasta reactivar esta opción.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tiers and Pricing */}
          <TabsContent value="tiers" className="space-y-6">
            {settings && Object.entries(settings.tiers).map(([tier, tierData]) => (
              <Card key={tier} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Pack Familiar {tier} ({tierData.monthly.slots} asistentes)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tierData.featured}
                        onCheckedChange={() => toggleTierFeatured(tier as '3' | '5' | '8')}
                      />
                      <Badge className={tierData.featured ? "bg-yellow-500" : "bg-gray-500"}>
                        {tierData.featured ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Destacado
                          </>
                        ) : (
                          'Normal'
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Facturación Mensual
                      </h4>
                      <div>
                        <Label className="text-white">Price ID (Stripe)</Label>
                        <Input
                          value={tierData.monthly.priceId}
                          onChange={(e) => updateTierPrice(tier as '3' | '5' | '8', 'monthly', 'priceId', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                          placeholder="price_..."
                        />
                      </div>
                      <div>
                        <Label className="text-white">Precio (€/mes)</Label>
                        <Input
                          type="number"
                          value={tierData.monthly.price}
                          onChange={(e) => updateTierPrice(tier as '3' | '5' | '8', 'monthly', 'price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Asistentes incluidos</Label>
                        <Input
                          type="number"
                          value={tierData.monthly.slots}
                          onChange={(e) => {
                            const slots = parseInt(e.target.value) || 0;
                            setSettings({
                              ...settings,
                              tiers: {
                                ...settings.tiers,
                                [tier]: {
                                  ...settings.tiers[tier as '3' | '5' | '8'],
                                  monthly: { ...tierData.monthly, slots },
                                  annual: { ...tierData.annual, slots },
                                },
                              },
                            });
                          }}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Annual */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Facturación Anual
                      </h4>
                      <div>
                        <Label className="text-white">Price ID (Stripe)</Label>
                        <Input
                          value={tierData.annual.priceId}
                          onChange={(e) => updateTierPrice(tier as '3' | '5' | '8', 'annual', 'priceId', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                          placeholder="price_..."
                        />
                      </div>
                      <div>
                        <Label className="text-white">Precio (€/año)</Label>
                        <Input
                          type="number"
                          value={tierData.annual.price}
                          onChange={(e) => updateTierPrice(tier as '3' | '5' | '8', 'annual', 'price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-sm text-slate-300">
                          <strong>Equivalente mensual:</strong> €{Math.round(tierData.annual.price / 12)} 
                          <br />
                          <strong>Ahorro vs mensual:</strong> €{(tierData.monthly.price * 12 - tierData.annual.price)} 
                          ({Math.round(((tierData.monthly.price * 12 - tierData.annual.price) / (tierData.monthly.price * 12)) * 100)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Add-ons */}
          <TabsContent value="addons" className="space-y-6">
            {settings && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Asistentes Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Add-on */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Add-on Mensual</h4>
                      <div>
                        <Label className="text-white">Price ID (Stripe)</Label>
                        <Input
                          value={settings.addonPublic.monthly.priceId}
                          onChange={(e) => updateAddonPrice('monthly', 'priceId', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                          placeholder="price_..."
                        />
                      </div>
                      <div>
                        <Label className="text-white">Precio (€/mes por asistente)</Label>
                        <Input
                          type="number"
                          value={settings.addonPublic.monthly.price}
                          onChange={(e) => updateAddonPrice('monthly', 'price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Annual Add-on */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Add-on Anual</h4>
                      <div>
                        <Label className="text-white">Price ID (Stripe)</Label>
                        <Input
                          value={settings.addonPublic.annual.priceId}
                          onChange={(e) => updateAddonPrice('annual', 'priceId', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                          placeholder="price_..."
                        />
                      </div>
                      <div>
                        <Label className="text-white">Precio (€/año por asistente)</Label>
                        <Input
                          type="number"
                          value={settings.addonPublic.annual.price}
                          onChange={(e) => updateAddonPrice('annual', 'price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-sm text-slate-300">
                          <strong>Equivalente mensual:</strong> €{Math.round(settings.addonPublic.annual.price / 12)}
                          <br />
                          <strong>Ahorro vs mensual:</strong> €{(settings.addonPublic.monthly.price * 12 - settings.addonPublic.annual.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      Los add-ons permiten a los usuarios añadir hasta 10 asistentes adicionales 
                      a cualquier pack familiar. Se facturan junto con el pack base.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
