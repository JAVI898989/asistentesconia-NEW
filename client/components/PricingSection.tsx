import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Crown,
  Check,
  Plus,
  Minus,
  Gift,
  AlertTriangle,
  Loader2,
  CreditCard,
  Shield,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { ENV } from "@/lib/env";

interface PricingTier {
  tier: '3' | '5' | '8';
  name: string;
  assistants: number;
  monthlyPrice: number;
  annualPrice: number;
  featured: boolean;
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    tier: '3',
    name: 'Familiar 3',
    assistants: 3,
    monthlyPrice: 30,
    annualPrice: 300,
    featured: false,
  },
  {
    tier: '5',
    name: 'Familiar 5',
    assistants: 5,
    monthlyPrice: 44,
    annualPrice: 440,
    featured: false,
  },
  {
    tier: '8',
    name: 'Familiar 8',
    assistants: 8,
    monthlyPrice: 59,
    annualPrice: 590,
    featured: true,
  },
];

const ADDON_PRICING = {
  monthly: 8,
  annual: 80,
};

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [addonCounts, setAddonCounts] = useState<Record<string, number>>({
    '3': 0,
    '5': 0,
    '8': 0,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [stock, setStock] = useState<{ remaining: number; total: number } | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  const runDiagnostics = async () => {
    try {
      setShowDiagnostics(true);
      const response = await fetch('/api/checkout/diagnose');

      // Defensive response handling to prevent body stream issues
      let data;
      try {
        const responseText = await response.text();
        if (responseText) {
          data = JSON.parse(responseText);
        } else {
          data = { error: 'Empty response from diagnostic endpoint' };
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse diagnostic response, using fallback data');
        data = {
          error: 'Could not parse diagnostic response',
          ok: false,
          mode: 'unknown',
          environment: {
            hasPublishableKey: !!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            site: window.location.origin,
            timestamp: new Date().toISOString()
          }
        };
      }

      setDiagnosticData(data);
      console.log('🔍 Comprehensive Stripe Diagnostics:', data);

      // Log key diagnostic results to console for debugging
      if (data.ok) {
        console.log('✅ Diagnostic Summary:', {
          mode: data.mode,
          accountActive: data.account?.charges_enabled,
          validPriceFound: data.priceCheck !== 'NO_VALID_PRICE_FOUND',
          sessionCreated: typeof data.sessionPreview === 'object' && data.sessionPreview.id,
          urlValid: data.sessionPreview?.urlStartsWith?.startsWith('https://checkout.stripe.com/')
        });
      }

    } catch (error) {
      console.error('��� Diagnostic error:', error);
      toast.error('Error ejecutando diagnósticos');

      // Set fallback diagnostic data so the modal still shows something useful
      setDiagnosticData({
        error: 'Network error during diagnostics',
        ok: false,
        mode: 'unknown',
        environment: {
          hasPublishableKey: !!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          site: window.location.origin,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  useEffect(() => {
    // Load stock information
    loadStockInfo();
  }, []);

  const loadStockInfo = async () => {
    try {
      // This would normally load from Firestore, but for now use static data
      setStock({ remaining: 200, total: 200 });
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const updateAddonCount = (tier: '3' | '5' | '8', delta: number) => {
    setAddonCounts(prev => ({
      ...prev,
      [tier]: Math.max(0, Math.min(10, prev[tier] + delta))
    }));
  };

  const calculateTotal = (tier: PricingTier) => {
    const basePrice = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
    const addonPrice = billingCycle === 'monthly' ? ADDON_PRICING.monthly : ADDON_PRICING.annual;
    const addonTotal = addonCounts[tier.tier] * addonPrice;
    return basePrice + addonTotal;
  };

  const calculateSavings = (tier: PricingTier) => {
    const monthlyTotal = tier.monthlyPrice * 12;
    const annualTotal = tier.annualPrice;
    return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
  };

  const handleSelectPlan = (tier: PricingTier) => {
    setSelectedTier(tier);
    setShowCheckoutModal(true);
  };

  const handleProceedToCheckout = async () => {
    if (!selectedTier) return;

    setIsCreatingSession(true);

    try {
      console.log('🚀 Creating Stripe hosted checkout session:', {
        tier: selectedTier.tier,
        billingCycle,
        addonPublicCount: addonCounts[selectedTier.tier],
        referralCode: referralCode.trim() || 'none'
      });

      const response = await fetch('/api/checkout/family-pack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier.tier,
          billingCycle,
          addonPublicCount: addonCounts[selectedTier.tier],
          referralCode: referralCode.trim() || undefined,
          userId: 'demo-user', // This should come from auth context
          userEmail: 'demo@example.com', // This should come from auth context
          userRole: 'alumno', // This should come from user data
        }),
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.details || 'Failed to create checkout session';
          console.error('❌ Checkout session creation failed:', errorData);
        } catch (parseError) {
          errorText = await response.text();
          console.error('❌ Checkout session creation failed (parse error):', errorText, parseError);
        }
        throw new Error(errorText);
      }

      const data = await response.json();

      if (!data.url) {
        console.error('❌ Invalid checkout response:', data);
        throw new Error('No checkout URL received from server');
      }

      console.log('✅ Stripe session URL =>', data.url);
      console.log('✅ Session ID:', data.id);

      // Validate URL format (additional safety check)
      if (!data.url.startsWith('https://checkout.stripe.com/')) {
        console.warn('⚠️ Unexpected URL format:', data.url);
      }

      // Close modal and open Stripe in external window (forces outside IDE/preview)
      setShowCheckoutModal(false);

      // Force external window - prevents IDE embedded preview issues
      window.open(data.url, '_blank', 'noopener,noreferrer,width=800,height=600');

      // Alternative: Use direct navigation (comment line above, uncomment below)
      // window.location.assign(data.url);

    } catch (error) {
      console.error('❌ Checkout error:', error);

      // Show specific error messages based on server response
      let errorMessage = 'Error al procesar el pago. Intenta de nuevo.';

      if (error instanceof Error) {
        const msg = error.message;

        // Map server error messages to user-friendly ones
        if (msg === 'priceId del plan no configurado') {
          errorMessage = 'Configura los precios en Admin';
        } else if (msg === 'El precio del plan está inactivo en Stripe') {
          errorMessage = 'Activa el precio en Stripe o usa el correcto';
        } else if (msg === 'Ciclo inválido' || msg === 'Tier inválido') {
          errorMessage = 'Bug de front - corrige selectores';
        } else if (msg === 'Ventas desactivadas') {
          errorMessage = 'Las ventas están desactivadas temporalmente';
        } else if (msg === 'Agotado') {
          errorMessage = 'Packs familiares agotados';
        } else if (msg.includes('priceId del add-on no configurado')) {
          errorMessage = 'Configura el precio del add-on en Admin';
        } else if (msg.includes('add-on no es recurrente/activo')) {
          errorMessage = 'El add-on no está configurado correctamente en Stripe';
        } else if (msg.includes('Falta STRIPE_SECRET_KEY')) {
          errorMessage = 'Configuración de Stripe incompleta - contacta al soporte';
        } else if (msg.includes('[object Object]') || msg === '') {
          errorMessage = 'Error al procesar el pago. Verifica tu conexión e intenta de nuevo.';
        } else {
          errorMessage = msg;
        }
      } else {
        // Handle non-Error exceptions
        console.error('Non-Error exception:', error);
        errorMessage = 'Error desconocido al procesar el pago.';
      }

      toast.error(errorMessage);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const isOutOfStock = stock ? stock.remaining <= 0 : false;

  // Environment check for debugging
  const hasStripePublishableKey = !!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isTestMode = ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('pk_test');

  return (
    <section className="py-20 bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-6">


        {/* Test Mode Indicator */}
        {ENV.isDevelopment && isTestMode && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Modo de Pruebas de Stripe</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Usando claves de prueba. Usa tarjeta 4242 4242 4242 4242 para testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground">Precios</h2>
          </div>

          {/* Brief List */}
          <div className="max-w-md mx-auto mb-8 text-left bg-muted/30 rounded-lg p-6">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex justify-between">
                <span>Familiar 3</span>
                <span>30 €/mes (3 asistentes)</span>
              </li>
              <li className="flex justify-between">
                <span>Familiar 5</span>
                <span>44 €/mes (5 asistentes)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Familiar 8</span>
                <div className="flex items-center gap-2">
                  <span>59 €/mes (8 asistentes)</span>
                  <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">
                    Mejor valor
                  </Badge>
                </div>
              </li>
            </ul>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label className={`text-lg ${billingCycle === 'monthly' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Mensual
            </Label>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              className="scale-125"
            />
            <Label className={`text-lg ${billingCycle === 'annual' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Anual
            </Label>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-500/20 text-green-400 ml-2">
                <Gift className="w-3 h-3 mr-1" />
                ≈ 2 meses gratis
              </Badge>
            )}
          </div>
        </div>

        {/* Stock Alert */}
        {stock && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className={`border-2 ${isOutOfStock ? 'border-red-500/50 bg-red-500/10' : stock.remaining <= 20 ? 'border-orange-500/50 bg-orange-500/10' : 'border-blue-500/50 bg-blue-500/10'}`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {isOutOfStock ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Gift className="w-5 h-5 text-blue-400" />
                  )}
                  <span className={`font-semibold ${isOutOfStock ? 'text-red-400' : 'text-blue-400'}`}>
                    {isOutOfStock ? 'Agotado' : `Quedan ${stock.remaining}/${stock.total}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEFAULT_TIERS.map((tier) => {
            const total = calculateTotal(tier);
            const savings = calculateSavings(tier);
            const addonPrice = billingCycle === 'monthly' ? ADDON_PRICING.monthly : ADDON_PRICING.annual;
            const isLoadingTier = loading[tier.tier];

            return (
              <Card
                key={tier.tier}
                className={`relative rounded-2xl shadow-sm p-6 transition-all duration-200 ${
                  tier.featured ? 'border-2 border-blue-500 scale-105 bg-blue-50/50' : 'border-border'
                } ${isOutOfStock ? 'opacity-60' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white px-4 py-1 shadow-lg">
                      <Crown className="w-3 h-3 mr-1" />
                      Mejor valor
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-sm text-muted-foreground mb-4">
                    {tier.assistants} asistentes
                  </div>

                  {/* Both prices visible */}
                  <div className="space-y-2">
                    <div className={`${billingCycle === 'monthly' ? 'text-3xl font-bold' : 'text-lg text-muted-foreground'}`}>
                      €{tier.monthlyPrice}/mes
                    </div>
                    <div className={`${billingCycle === 'annual' ? 'text-3xl font-bold' : 'text-lg text-muted-foreground'}`}>
                      €{tier.annualPrice}/año
                      {billingCycle === 'annual' && (
                        <div className="text-sm text-green-600 mt-1">
                          Ahorras {savings}%
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{tier.assistants} asistentes simultáneos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Acceso a todos los asistentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Chat ilimitado 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Soporte prioritario</span>
                    </div>
                  </div>

                  {/* Add-on Selector */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Asistentes públicos adicionales</Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddonCount(tier.tier, -1)}
                          disabled={addonCounts[tier.tier] === 0}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{addonCounts[tier.tier]}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddonCount(tier.tier, 1)}
                          disabled={addonCounts[tier.tier] === 10}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        +{addonPrice} €/{billingCycle === 'monthly' ? 'mes' : 'año'} c/u
                      </div>
                    </div>
                    {addonCounts[tier.tier] > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        +{addonCounts[tier.tier] * addonPrice} € por {addonCounts[tier.tier]} asistente{addonCounts[tier.tier] > 1 ? 's' : ''} adicional{addonCounts[tier.tier] > 1 ? 'es' : ''}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="text-lg font-bold text-center">
                      Total {billingCycle === 'monthly' ? 'Mensual' : 'Anual'}: €{total}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(tier)}
                    disabled={isOutOfStock}
                    className={`w-full ${tier.featured ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                    size="lg"
                  >
                    {isOutOfStock ? (
                      'Agotado'
                    ) : (
                      `Pagar ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Checkout Modal */}
        <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Finalizar Suscripción - {selectedTier?.name}</DialogTitle>
              <DialogDescription>
                Revisa tu selección y procede al pago seguro con Stripe
              </DialogDescription>
            </DialogHeader>

            {selectedTier && (
              <div className="space-y-6">
                {/* Purchase Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Resumen de tu suscripción:</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{selectedTier.name}:</span>
                      <span className="font-medium">
                        €{billingCycle === 'monthly' ? selectedTier.monthlyPrice : selectedTier.annualPrice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>• {selectedTier.assistants} asistentes incluidos</span>
                      <span>{billingCycle === 'monthly' ? 'Mensual' : 'Anual'}</span>
                    </div>

                    {addonCounts[selectedTier.tier] > 0 && (
                      <div className="flex justify-between">
                        <span>{addonCounts[selectedTier.tier]} asistente{addonCounts[selectedTier.tier] > 1 ? 's' : ''} adicional{addonCounts[selectedTier.tier] > 1 ? 'es' : ''}:</span>
                        <span className="font-medium">
                          €{addonCounts[selectedTier.tier] * (billingCycle === 'monthly' ? ADDON_PRICING.monthly : ADDON_PRICING.annual)}
                        </span>
                      </div>
                    )}

                    {billingCycle === 'annual' && (
                      <div className="text-sm text-green-600">
                        ✅ Ahorras {calculateSavings(selectedTier)}% con facturación anual
                      </div>
                    )}

                    <hr className="my-3" />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span>€{calculateTotal(selectedTier)}/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                  </div>
                </div>

                {/* Referral Code Input */}
                <div className="space-y-3">
                  <Label htmlFor="referralCode">Código de referidos (opcional)</Label>
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Ej: ALU-ABC123 o ACA-XYZ789"
                    className="font-mono"
                  />
                  <p className="text-sm text-gray-600">
                    Si tienes un código de referidos, ingrésalo para obtener beneficios especiales
                  </p>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Pago 100% seguro</p>
                    <p className="text-sm text-blue-600">
                      Tu información de pago está protegida por Stripe, el procesador más seguro del mundo.
                      No almacenamos datos de tarjetas.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1"
                    disabled={isCreatingSession}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={isCreatingSession}
                    className="flex-1"
                    size="lg"
                  >
                    {isCreatingSession ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando sesión...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar con Stripe
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Diagnostic Modal (Dev Only) */}
        {ENV.isDevelopment && (
          <Dialog open={showDiagnostics} onOpenChange={setShowDiagnostics}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>🔍 Diagnóstico de Stripe</DialogTitle>
                <DialogDescription>
                  Información de configuración y estado del sistema de pagos
                </DialogDescription>
              </DialogHeader>

              {diagnosticData && (
                <div className="space-y-6">
                  {/* Overall Status */}
                  <div>
                    <h3 className="font-semibold mb-2">📊 Estado General</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className={`font-medium ${diagnosticData.ok ? 'text-green-600' : 'text-red-600'}`}>
                        {diagnosticData.ok ? '✅ Diagnóstico Exitoso' : '❌ Problemas Detectados'}
                      </div>
                      <div>Modo: <span className="font-mono">{diagnosticData.mode || 'unknown'}</span></div>
                    </div>
                  </div>

                  {/* Environment */}
                  <div>
                    <h3 className="font-semibold mb-2">🌍 Entorno</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                      <div>Frontend PK: {ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Configurado' : '❌ Ausente'}</div>
                      <div>Backend SK: {diagnosticData.environment?.hasPublishableKey !== false ? '✅ Presente' : '❌ Ausente'}</div>
                      <div>Site URL: <span className="font-mono text-xs">{diagnosticData.environment?.site || window.location.origin}</span></div>
                    </div>
                  </div>

                  {/* Account Status */}
                  {diagnosticData.account && (
                    <div>
                      <h3 className="font-semibold mb-2">🏪 Cuenta Stripe</h3>
                      <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                        <div>ID: <span className="font-mono text-xs">{diagnosticData.account.id}</span></div>
                        <div>Pagos habilitados: {diagnosticData.account.charges_enabled ? '✅ Sí' : '❌ No'}</div>
                        <div>Detalles enviados: {diagnosticData.account.details_submitted ? '✅ Sí' : '⚠️ No'}</div>
                      </div>
                    </div>
                  )}

                  {/* Price Check */}
                  <div>
                    <h3 className="font-semibold mb-2">💰 Validación de Precios</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      {typeof diagnosticData.priceCheck === 'object' ? (
                        <div className="space-y-1">
                          <div>✅ Precio válido encontrado</div>
                          <div>ID: <span className="font-mono text-xs">{diagnosticData.priceCheck.id}</span></div>
                          <div>Activo: {diagnosticData.priceCheck.active ? '✅ Sí' : '❌ No'}</div>
                          <div>Tipo: {diagnosticData.priceCheck.type} {diagnosticData.priceCheck.type === 'recurring' ? '✅' : '❌'}</div>
                          <div>Modo: {diagnosticData.priceCheck.livemode ? 'live' : 'test'}</div>
                        </div>
                      ) : (
                        <div className="text-amber-600">⚠️ {diagnosticData.priceCheck}</div>
                      )}
                    </div>
                  </div>

                  {/* Session Test */}
                  <div>
                    <h3 className="font-semibold mb-2">🧪 Test de Sesión</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      {typeof diagnosticData.sessionPreview === 'object' && diagnosticData.sessionPreview.id ? (
                        <div className="space-y-1">
                          <div>✅ Sesión de prueba creada</div>
                          <div>ID: <span className="font-mono text-xs">{diagnosticData.sessionPreview.id}</span></div>
                          <div>URL: <span className="font-mono text-xs">{diagnosticData.sessionPreview.urlStartsWith}...</span></div>
                          <div>Válida: {diagnosticData.sessionPreview.urlStartsWith?.startsWith('https://checkout.stripe.com/') ? '✅ Sí' : '❌ No'}</div>
                        </div>
                      ) : (
                        <div className="text-red-600">❌ {diagnosticData.sessionPreview}</div>
                      )}
                    </div>
                  </div>

                  {/* Error Information */}
                  {diagnosticData.error && (
                    <div>
                      <h3 className="font-semibold mb-2">⚠️ Error</h3>
                      <div className="bg-red-50 p-3 rounded text-sm text-red-700">
                        {diagnosticData.error}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Timestamp: {diagnosticData.environment?.timestamp || diagnosticData.timestamp || new Date().toISOString()}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
