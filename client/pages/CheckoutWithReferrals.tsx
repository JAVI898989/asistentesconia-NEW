import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import ReferralCodeInput from "@/components/ReferralCodeInput";
import { createCheckoutSessionWithReferral } from "@/lib/stripeWithReferrals";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import type { ReferralValidationResult } from "@/types/referral";

interface AssistantInfo {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  isFounder: boolean;
}

export default function CheckoutWithReferrals() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [validReferral, setValidReferral] = useState<ReferralValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Parse URL parameters
    const assistantId = searchParams.get("assistant");
    const assistantName = searchParams.get("name");
    const price = searchParams.get("price");
    const billingCycle = searchParams.get("billing") as "monthly" | "annual";
    const isFounder = searchParams.get("founder") === "true";
    const referralCode = searchParams.get("ref");

    if (assistantId && assistantName && price && billingCycle) {
      setAssistant({
        id: assistantId,
        name: assistantName,
        price: parseFloat(price),
        billingCycle,
        isFounder,
      });

      // If there's a referral code in URL, auto-validate it
      if (referralCode) {
        // Auto-validate the referral code
        // This would call the validation function
      }
    } else {
      navigate("/asistentes");
    }

    return () => unsubscribe();
  }, [searchParams, navigate]);

  const handleValidReferral = (validation: ReferralValidationResult) => {
    setValidReferral(validation);
  };

  const handleContinueToPayment = () => {
    setShowPayment(true);
  };

  const handleBackToReferral = () => {
    setShowPayment(false);
    setValidReferral(null);
  };

  const handleProceedToStripe = async () => {
    if (!assistant || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      await createCheckoutSessionWithReferral({
        assistantId: assistant.id,
        assistantName: assistant.name,
        price: assistant.price,
        billingCycle: assistant.billingCycle,
        isFounder: assistant.isFounder,
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        referralCode: validReferral?.code,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago");
      setLoading(false);
    }
  };

  if (!assistant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Finalizar Suscripción
          </h1>
          <p className="text-gray-600">
            Suscríbete a {assistant.name} y accede a todo el contenido
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!showPayment ? (
          /* Referral Code Step */
          <ReferralCodeInput
            onValidReferral={handleValidReferral}
            onContinue={handleContinueToPayment}
            userId={currentUser?.uid}
            userEmail={currentUser?.email || ""}
            assistantName={assistant.name}
            price={assistant.price}
            isOptional={true}
          />
        ) : (
          /* Payment Confirmation Step */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Confirmar Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purchase Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Resumen de tu suscripción:</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Asistente:</span>
                    <span className="font-medium">{assistant.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">
                      {assistant.isFounder ? "Precio Fundador" : "Precio Normal"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Facturación:</span>
                    <span className="font-medium">
                      {assistant.billingCycle === "monthly" ? "Mensual" : "Anual"}
                    </span>
                  </div>
                  
                  {validReferral?.isValid && (
                    <div className="flex justify-between text-green-600">
                      <span>Código de referidos:</span>
                      <span className="font-mono font-bold">{validReferral.code}</span>
                    </div>
                  )}
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>€{assistant.price}/{assistant.billingCycle === "monthly" ? "mes" : "año"}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>Pago seguro:</strong> Tu información de pago está protegida por Stripe, 
                  el procesador de pagos más seguro del mundo. No almacenamos datos de tarjetas.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBackToReferral}
                  className="flex-1"
                  disabled={loading}
                >
                  Cambiar Referido
                </Button>
                <Button
                  onClick={handleProceedToStripe}
                  disabled={loading || !currentUser}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar con Stripe
                    </>
                  )}
                </Button>
              </div>

              {!currentUser && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Debes estar conectado para realizar una compra. 
                    <Button variant="link" className="h-auto p-0 ml-1" onClick={() => navigate("/login")}>
                      Iniciar sesión
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
