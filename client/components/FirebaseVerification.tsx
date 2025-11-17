import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { connectAuthEmulator, connectFirestoreEmulator } from "firebase/auth";

interface FirebaseVerificationProps {
  onSuccess?: () => void;
}

export const FirebaseVerification: React.FC<FirebaseVerificationProps> = ({
  onSuccess,
}) => {
  const [verificationResults, setVerificationResults] = useState<any>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
    console.log(message);
  };

  const verifyFirebaseSetup = async () => {
    setIsVerifying(true);
    const results: any = {};

    try {
      // Check current domain
      const currentDomain = window.location.hostname;
      results.domain = currentDomain;
      addLog(`Dominio actual: ${currentDomain}`);

      // Verify Firebase Auth initialization
      if (auth) {
        results.authInitialized = true;
        addLog("✅ Firebase Auth inicializado");

        // Get auth settings
        try {
          const authSettings = (auth as any).config;
          results.projectId = authSettings?.projectId || "cursor-64188";
          results.authDomain =
            authSettings?.authDomain || "cursor-64188.firebaseapp.com";
          addLog(`Proyecto Firebase: ${results.projectId}`);
          addLog(`Dominio Auth: ${results.authDomain}`);
        } catch (e) {
          addLog("⚠️ No se pudo obtener configuración de auth");
        }
      } else {
        results.authInitialized = false;
        addLog("❌ Firebase Auth NO inicializado");
      }

      // Verify Firestore initialization
      if (db) {
        results.firestoreInitialized = true;
        addLog("✅ Firestore inicializado");
      } else {
        results.firestoreInitialized = false;
        addLog("❌ Firestore NO inicializado");
      }

      // Test network connectivity to Firebase
      try {
        addLog("🔍 Probando conectividad a Firebase...");
        const testResponse = await fetch(
          "https://identitytoolkit.googleapis.com/v1/projects/cursor-64188:lookup?key=AIzaSyBwGMqSpzZ4BRXIoEnlQ2hv3QbHvrLIC8",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          },
        );

        if (testResponse.ok || testResponse.status === 400) {
          results.networkConnectivity = true;
          addLog("✅ Conectividad a Firebase OK");
        } else {
          results.networkConnectivity = false;
          addLog(`❌ Error de conectividad: ${testResponse.status}`);
        }
      } catch (e: any) {
        results.networkConnectivity = false;
        addLog(`❌ Error de red: ${e.message}`);
      }

      // Check if domain needs to be added
      if (currentDomain.includes("fly.dev")) {
        addLog("🔧 Dominio Fly.dev detectado - verificando autorización...");
        results.flyDomainDetected = true;
      }

      setVerificationResults(results);
    } catch (error: any) {
      addLog(`❌ Error en verificación: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyDomainToClipboard = () => {
    navigator.clipboard.writeText(window.location.hostname);
    addLog("📋 Dominio copiado al clipboard");
  };

  const openFirebaseConsole = () => {
    const url =
      "https://console.firebase.google.com/project/cursor-64188/authentication/settings";
    window.open(url, "_blank");
    addLog("🌐 Abriendo Firebase Console...");
  };

  useEffect(() => {
    verifyFirebaseSetup();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-800">
          🔧 Verificación de Firebase
        </h3>
        <button
          onClick={verifyFirebaseSetup}
          disabled={isVerifying}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isVerifying ? "Verificando..." : "🔄 Verificar"}
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-700">Auth Status</div>
          <div
            className={`text-sm ${verificationResults.authInitialized ? "text-green-600" : "text-red-600"}`}
          >
            {verificationResults.authInitialized
              ? "✅ Inicializado"
              : "❌ Error"}
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-700">Network</div>
          <div
            className={`text-sm ${verificationResults.networkConnectivity ? "text-green-600" : "text-red-600"}`}
          >
            {verificationResults.networkConnectivity
              ? "✅ Conectado"
              : "❌ Sin conexión"}
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-700">Proyecto</div>
          <div className="text-sm text-gray-600">
            {verificationResults.projectId || "cursor-64188"}
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-700">Dominio</div>
          <div className="text-sm text-gray-600 truncate">
            {verificationResults.domain || "Detectando..."}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={copyDomainToClipboard}
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          📋 Copiar Dominio
        </button>
        <button
          onClick={openFirebaseConsole}
          className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
        >
          🌐 Firebase Console
        </button>
      </div>

      {/* Instructions */}
      {verificationResults.flyDomainDetected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <div className="text-sm font-medium text-yellow-800 mb-2">
            🚨 Acción requerida para dominio Fly.dev
          </div>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>
              1. Copia el dominio:{" "}
              <code className="bg-yellow-100 px-1 rounded font-mono">
                {verificationResults.domain}
              </code>
            </li>
            <li>2. Ve a Firebase Console (botón arriba)</li>
            <li>3. Authentication → Settings → Authorized domains</li>
            <li>4. Click "Add domain" y pega el dominio</li>
            <li>5. Guarda y recarga esta página</li>
          </ol>
        </div>
      )}

      {/* Logs */}
      <div className="bg-gray-50 border rounded p-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          📋 Logs de verificación:
        </div>
        <div className="text-xs text-gray-600 max-h-32 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirebaseVerification;
