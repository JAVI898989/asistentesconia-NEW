import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NetworkTest {
  name: string;
  url: string;
  method: string;
  expected: string;
  result?: "success" | "error" | "pending";
  message?: string;
}

export const NetworkDiagnostics: React.FC = () => {
  const [tests, setTests] = useState<NetworkTest[]>([
    {
      name: "Google (Basic Internet)",
      url: "https://www.google.com",
      method: "HEAD",
      expected: "200 OK",
    },
    {
      name: "Firebase API",
      url: "https://identitytoolkit.googleapis.com",
      method: "HEAD",
      expected: "200 OK",
    },
    {
      name: "Firebase Auth Endpoint",
      url: "https://identitytoolkit.googleapis.com/v1/projects/cursor-64188",
      method: "GET",
      expected: "401/403 (Auth required)",
    },
    {
      name: "Firestore API",
      url: "https://firestore.googleapis.com",
      method: "HEAD",
      expected: "200 OK",
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const runTest = async (test: NetworkTest): Promise<NetworkTest> => {
    try {
      addLog(`Testing ${test.name}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(test.url, {
        method: test.method,
        mode: "no-cors", // Try to bypass CORS
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      // With no-cors, we can't read the response, but if it doesn't throw, it's reachable
      return {
        ...test,
        result: "success",
        message: `✅ Reachable (no-cors mode)`,
      };
    } catch (error: any) {
      addLog(`❌ ${test.name} failed: ${error.message}`);

      if (error.name === "AbortError") {
        return {
          ...test,
          result: "error",
          message: "⏰ Timeout (10s)",
        };
      }

      // Try with different approach
      try {
        addLog(`Trying alternative method for ${test.name}...`);
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
          img.onload = () => resolve("success");
          img.onerror = () => reject("error");
          setTimeout(() => reject("timeout"), 5000);
        });

        img.src = test.url + "?t=" + Date.now();
        await promise;

        return {
          ...test,
          result: "success",
          message: "✅ Reachable (image method)",
        };
      } catch {
        return {
          ...test,
          result: "error",
          message: `❌ ${error.message}`,
        };
      }
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    addLog("🔍 Starting network diagnostics...");

    const results: NetworkTest[] = [];

    for (const test of tests) {
      setTests((current) =>
        current.map((t) =>
          t.name === test.name ? { ...t, result: "pending" } : t,
        ),
      );

      const result = await runTest(test);
      results.push(result);

      setTests((current) =>
        current.map((t) => (t.name === result.name ? result : t)),
      );
    }

    setIsRunning(false);
    addLog("✅ Network diagnostics completed");

    // Analyze results
    const successCount = results.filter((r) => r.result === "success").length;
    const totalCount = results.length;

    if (successCount === 0) {
      addLog("🚨 CRITICAL: No network connectivity detected");
    } else if (successCount < totalCount) {
      addLog("⚠️ WARNING: Partial connectivity - Firebase may be blocked");
    } else {
      addLog("✅ GOOD: All endpoints reachable");
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-800">
          🌐 Diagnósticos de Red
        </h3>
        <div className="space-x-2">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRunning ? "Probando..." : "🔍 Probar Red"}
          </Button>
          <Button onClick={clearLogs} size="sm" variant="outline">
            🗑️ Limpiar
          </Button>
        </div>
      </div>

      {/* Test Results Grid */}
      <div className="grid gap-2 mb-4">
        {tests.map((test, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded border flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-sm">{test.name}</div>
              <div className="text-xs text-gray-500">{test.url}</div>
            </div>
            <div className="text-right">
              {test.result === "pending" && (
                <div className="text-blue-600 text-sm">⏳ Probando...</div>
              )}
              {test.result === "success" && (
                <div className="text-green-600 text-sm">✅ OK</div>
              )}
              {test.result === "error" && (
                <div className="text-red-600 text-sm">❌ Error</div>
              )}
              {test.message && (
                <div className="text-xs text-gray-600 mt-1">{test.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-gray-50 border rounded p-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          📋 Logs de diagnóstico:
        </div>
        <div className="text-xs text-gray-600 max-h-32 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-400 italic">
              No hay logs aún. Presiona "Probar Red" para comenzar.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="font-mono">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommendations based on results */}
      {tests.some((t) => t.result === "error") && (
        <Alert className="mt-4">
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">🔧 Posibles soluciones:</div>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Verifica tu conexión a internet</li>
                <li>
                  ��� El firewall de Fly.dev puede estar bloqueando Firebase
                </li>
                <li>
                  • Contacta al soporte de Fly.dev sobre conectividad a
                  googleapis.com
                </li>
                <li>• Usa el modo offline/demo como alternativa temporal</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NetworkDiagnostics;
