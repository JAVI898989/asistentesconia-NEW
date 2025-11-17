import React, { useState } from "react";

interface FirebaseDomainFixProps {
  currentDomain: string;
  projectId: string;
}

export const FirebaseDomainFix: React.FC<FirebaseDomainFixProps> = ({
  currentDomain,
  projectId,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Dominio no autorizado en Firebase
          </h3>
        </div>
      </div>

      <div className="text-sm text-red-700 mb-4">
        <p className="mb-2">
          El dominio{" "}
          <code className="bg-red-100 px-1 rounded font-mono">
            {currentDomain}
          </code>{" "}
          no está autorizado en Firebase Console.
        </p>
        <p className="mb-4">Sigue estos pasos para solucionarlo:</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">
            🔧 Paso 1: Copia el dominio
          </h4>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm flex-1">
              {currentDomain}
            </code>
            <button
              onClick={() => copyToClipboard(currentDomain)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              {copied ? "✅ Copiado" : "📋 Copiar"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">
            🌐 Paso 2: Abre Firebase Console
          </h4>
          <a
            href={firebaseConsoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            🔗 Abrir Firebase Console
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">
            ⚙️ Paso 3: Navega a Authentication Settings
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
            <li>
              Ve a <strong>Authentication</strong> en el menú lateral
            </li>
            <li>
              Click en la pestaña <strong>Settings</strong>
            </li>
            <li>
              Busca la sección <strong>"Authorized domains"</strong>
            </li>
          </ol>
        </div>

        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">
            ➕ Paso 4: Añadir dominio
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
            <li>
              Click en <strong>"Add domain"</strong>
            </li>
            <li>
              Pega el dominio:{" "}
              <code className="bg-gray-100 px-1 rounded font-mono">
                {currentDomain}
              </code>
            </li>
            <li>
              Click en <strong>"Add"</strong>
            </li>
          </ol>
        </div>

        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">
            🔄 Paso 5: Probar nuevamente
          </h4>
          <p className="text-sm text-red-700">
            Una vez añadido el dominio, recarga esta página e intenta hacer
            login nuevamente. Puede tomar unos minutos en propagarse.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            🔄 Recargar página
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-xs text-yellow-800">
          <strong>Nota:</strong> Este dominio cambia cada vez que se redeploya
          en Fly.dev. Es posible que necesites repetir este proceso después de
          redeployments.
        </p>
      </div>
    </div>
  );
};

export default FirebaseDomainFix;
