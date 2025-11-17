import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Crown,
  Euro,
  Calendar,
  Check,
  Gift,
  Star,
  Zap,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { getFamilyPackPricing } from "@/lib/familyPackService";
import ReferralCodeInput from "@/components/ReferralCodeInput";
import type { FamilyPackPricingData } from "@/types/familyPack";

interface FamilyPricingSectionProps {
  onCheckout?: (data: {
    tier: '3' | '5' | '8';
    billingCycle: 'monthly' | 'annual';
    addonPublicCount: number;
    referralCode?: string;
  }) => void;
}

export default function FamilyPricingSection({ onCheckout }: FamilyPricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [packs, setPacks] = useState<FamilyPackPricingData[]>([]);
  const [addonPrice, setAddonPrice] = useState({ monthly: 8, annual: 80 });
  const [remaining, setRemaining] = useState(200);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<FamilyPackPricingData | null>(null);
  const [addonCount, setAddonCount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      const pricingData = await getFamilyPackPricing();
      if (pricingData) {
        setPacks(pricingData.packs);
        setAddonPrice(pricingData.addonPrice);
        setRemaining(pricingData.remaining);
      }
    } catch (error) {
      console.error('Error loading family pack pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (pack: FamilyPackPricingData) => {
    return billingCycle === 'monthly' ? pack.monthlyPrice : pack.annualPrice;
  };

  const getPricePerAssistant = (pack: FamilyPackPricingData) => {
    const price = getPrice(pack);
    return Math.round(price / pack.slots);
  };

  const getAddonPrice = () => {
    return billingCycle === 'monthly' ? addonPrice.monthly : addonPrice.annual;
  };

  const getTotalPrice = (pack: FamilyPackPricingData) => {
    const basePrice = getPrice(pack);
    const totalAddonPrice = getAddonPrice() * addonCount;
    return basePrice + totalAddonPrice;
  };

  const handleSelectPack = (pack: FamilyPackPricingData) => {
    setSelectedPack(pack);
    setShowCheckoutModal(true);
  };

  const handleProceedToCheckout = (referralCode?: string) => {
    if (!selectedPack) return;

    if (onCheckout) {
      onCheckout({
        tier: selectedPack.tier,
        billingCycle,
        addonPublicCount: addonCount,
        referralCode,
      });
    }

    setShowCheckoutModal(false);
    setSelectedPack(null);
    setAddonCount(0);
  };

  const stockPercentage = ((200 - remaining) / 200) * 100;
  const isLowStock = remaining <= 20;
  const isSoldOut = remaining <= 0;

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-accent/20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando precios...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Packs Familiares
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Planes para <span className="text-blue-400">Toda la Familia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Acceso simultáneo para múltiples usuarios con beneficios especiales
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label className={`text-lg ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensual
            </Label>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              className="scale-125"
            />
            <Label className={`text-lg ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual
            </Label>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-500/20 text-green-400 ml-2">
                <Gift className="w-3 h-3 mr-1" />
                2 meses gratis
              </Badge>
            )}
          </div>
        </div>

        {/* Stock Alert */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className={`border-2 ${isLowStock ? 'border-orange-500/50 bg-orange-500/10' : 'border-blue-500/50 bg-blue-500/10'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isLowStock ? (
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Star className="w-5 h-5 text-blue-400" />
                  )}
                  <span className={`font-semibold ${isLowStock ? 'text-orange-400' : 'text-blue-400'}`}>
                    {isSoldOut ? 'Agotado' : `Quedan ${remaining}/200 packs`}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stockPercentage)}% vendidos
                </span>
              </div>
              <Progress value={stockPercentage} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Family Pack Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {packs.map((pack) => {
            const price = getPrice(pack);
            const pricePerAssistant = getPricePerAssistant(pack);
            const isPopular = pack.featured;

            return (
              <Card
                key={pack.tier}
                className={`relative ${isPopular ? 'border-2 border-blue-500 scale-105' : 'border-border'} ${isSoldOut ? 'opacity-60' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Mejor Valor
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Pack Familiar {pack.tier}</CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">€{price}</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'mes' : 'año'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    €{pricePerAssistant} por asistente
                  </div>
                  {billingCycle === 'annual' && pack.savings && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      Ahorras {pack.savings}%
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{pack.slots} asistentes simultáneos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Acceso a todos los asistentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Chat ilimitado 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Soporte prioritario</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600 font-medium">2 meses gratis incluidos</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleSelectPack(pack)}
                    disabled={isSoldOut}
                    className={`w-full ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                    size="lg"
                  >
                    {isSoldOut ? 'Agotado' : 'Elegir Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add-on Section */}
        {!isSoldOut && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-purple-500/50 bg-purple-500/10">
              <CardHeader>
                <CardTitle className="text-center text-purple-400">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Asistentes Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold">€{getAddonPrice()}</span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mes' : 'año'} por asistente adicional
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Añade hasta 10 asistentes adicionales a cualquier pack familiar
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Label>Asistentes adicionales:</Label>
                  <Select value={addonCount.toString()} onValueChange={(value) => setAddonCount(parseInt(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {addonCount > 0 && (
                  <div className="mt-2 text-sm text-purple-400">
                    +€{getAddonPrice() * addonCount} por {addonCount} asistente{addonCount > 1 ? 's' : ''} adicional{addonCount > 1 ? 'es' : ''}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Checkout Modal */}
        <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Finalizar Suscripción - Pack Familiar {selectedPack?.tier}</DialogTitle>
              <DialogDescription>
                Revisa tu selección y procede al pago seguro con Stripe
              </DialogDescription>
            </DialogHeader>

            {selectedPack && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Resumen de tu suscripción:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pack Familiar {selectedPack.tier}:</span>
                      <span className="font-medium">€{getPrice(selectedPack)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>• {selectedPack.slots} asistentes incluidos</span>
                      <span>{billingCycle === 'monthly' ? 'Mensual' : 'Anual'}</span>
                    </div>
                    {addonCount > 0 && (
                      <div className="flex justify-between">
                        <span>{addonCount} asistente{addonCount > 1 ? 's' : ''} adicional{addonCount > 1 ? 'es' : ''}:</span>
                        <span className="font-medium">€{getAddonPrice() * addonCount}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>€{getTotalPrice(selectedPack)}/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                    {billingCycle === 'annual' && selectedPack.savings && (
                      <div className="text-sm text-green-600">
                        ✅ Ahorras {selectedPack.savings}% con facturación anual
                      </div>
                    )}
                  </div>
                </div>

                {/* Referral Code Input */}
                <ReferralCodeInput
                  onValidReferral={(validation) => {
                    handleProceedToCheckout(validation.code);
                  }}
                  onContinue={() => {
                    handleProceedToCheckout();
                  }}
                  userId="demo-user" // This should be passed from auth context
                  userEmail="demo@example.com" // This should be passed from auth context
                  assistantName={`Pack Familiar ${selectedPack.tier}`}
                  price={getTotalPrice(selectedPack)}
                  isOptional={true}
                  showSummary={false}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
