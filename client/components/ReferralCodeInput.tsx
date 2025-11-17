import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Gift, Users } from "lucide-react";
import { resolveReferralCode } from "@/lib/referralService";
import type { ReferralValidationResult } from "@/types/referral";

interface ReferralCodeInputProps {
  onValidReferral: (validation: ReferralValidationResult) => void;
  onContinue: () => void;
  userId?: string;
  userEmail?: string;
  assistantName: string;
  price: number;
  isOptional?: boolean;
}

export default function ReferralCodeInput({
  onValidReferral,
  onContinue,
  userId,
  userEmail,
  assistantName,
  price,
  isOptional = true,
}: ReferralCodeInputProps) {
  const [referralCode, setReferralCode] = useState("");
  const [validation, setValidation] = useState<ReferralValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const validateCode = async () => {
    if (!referralCode.trim()) {
      setValidation(null);
      setHasValidated(false);
      return;
    }

    setLoading(true);
    try {
      const result = await resolveReferralCode(referralCode, userId);
      setValidation(result);
      setHasValidated(true);
      
      if (result.isValid) {
        onValidReferral(result);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        error: "Error al validar el código",
      });
      setHasValidated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (validation?.isValid) {
      onValidReferral(validation);
    }
    onContinue();
  };

  const canContinue = isOptional || (validation?.isValid);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-600" />
          Código de Referidos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isOptional 
            ? "¿Tienes un código de referidos? Introdúcelo aquí para beneficiarte." 
            : "Introduce un código de referidos válido para continuar."
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Purchase Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Resumen de compra:</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{assistantName}</span>
            <span className="font-medium">€{price}</span>
          </div>
        </div>

        {/* Referral Code Input */}
        <div className="space-y-2">
          <Label htmlFor="referralCode">
            Código de Referidos
            {!isOptional && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="flex gap-2">
            <Input
              id="referralCode"
              placeholder="ALU-XXXXXX o ACA-XXXXXX"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value.toUpperCase());
                setValidation(null);
                setHasValidated(false);
              }}
              className="font-mono"
              maxLength={10}
            />
            <Button
              variant="outline"
              onClick={validateCode}
              disabled={!referralCode.trim() || loading}
              size="sm"
            >
              {loading ? "..." : "Validar"}
            </Button>
          </div>
        </div>

        {/* Validation Result */}
        {hasValidated && validation && (
          <Alert variant={validation.isValid ? "default" : "destructive"}>
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertDescription>
              {validation.isValid ? (
                <div className="space-y-1">
                  <p className="font-medium text-green-700">✅ Código válido</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {validation.referrerRole === 'academia' ? (
                        <Users className="w-3 h-3 mr-1" />
                      ) : (
                        <Gift className="w-3 h-3 mr-1" />
                      )}
                      {validation.referrerRole === 'academia' ? 'Academia' : 'Alumno'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Código: {validation.code}
                    </span>
                  </div>
                </div>
              ) : (
                <p>{validation.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Benefits Info */}
        {!hasValidated && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900 mb-1">
              💡 ¿Qué es un código de referidos?
            </h5>
            <p className="text-xs text-blue-700">
              Los códigos de referidos permiten a otros usuarios recomendar nuestros servicios. 
              Tanto tú como quien te refiere pueden beneficiarse de promociones especiales.
            </p>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full"
          size="lg"
        >
          {validation?.isValid 
            ? "Continuar con Referido" 
            : "Continuar al Pago"
          }
        </Button>

        {!isOptional && !canContinue && (
          <p className="text-xs text-red-600 text-center">
            Debes introducir un código de referidos válido para continuar.
          </p>
        )}

        {isOptional && (
          <p className="text-xs text-gray-500 text-center">
            Puedes continuar sin código de referidos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
