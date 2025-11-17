import React, { useState } from "react";
import { loginUserDirect } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DirectLoginTest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDirectLogin = async () => {
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const result = await loginUserDirect(email, password);
      setResult(result);
      console.log("Direct login result:", result);
    } catch (error: any) {
      setError(error.message);
      console.error("Direct login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
      <h3 className="text-lg font-semibold text-green-800 mb-4">
        🧪 Test Login Directo (API REST)
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="direct-email">Email</Label>
          <Input
            id="direct-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direct-password">Contraseña</Label>
          <Input
            id="direct-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleDirectLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? "Probando..." : "🚀 Login Directo"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold text-green-700">
                  ✅ Login directo exitoso!
                </div>
                <div className="text-sm">
                  <div>User ID: {result.user.uid}</div>
                  <div>Email: {result.user.email}</div>
                  <div>Token: {result.token.substring(0, 20)}...</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/redirect")}
                  className="mt-2"
                >
                  Ir al Panel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DirectLoginTest;
