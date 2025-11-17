import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
  Database,
  Cloud,
  List,
  Settings,
  User,
  AlertTriangle,
  Info
} from "lucide-react";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  getDoc 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadString, 
  deleteObject 
} from "firebase/storage";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface DiagnosticCheck {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'success' | 'error' | 'running';
  message: string;
  details?: string;
  action?: string;
}

interface SystemDiagnosticProps {
  assistantId: string;
  assistantName: string;
}

export default function SystemDiagnostic({ assistantId, assistantName }: SystemDiagnosticProps) {
  const [user] = useAuthState(auth);
  const [checks, setChecks] = useState<DiagnosticCheck[]>([
    {
      id: 'admin-role',
      name: 'Rol Admin',
      icon: <Shield className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando permisos administrativos...'
    },
    {
      id: 'firestore-write',
      name: 'Firestore Write',
      icon: <Database className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando escritura en Firestore...'
    },
    {
      id: 'storage-write',
      name: 'Storage Write',
      icon: <Cloud className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando escritura en Storage...'
    },
    {
      id: 'firestore-indexes',
      name: 'Índices Firestore',
      icon: <List className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando índices requeridos...'
    },
    {
      id: 'env-variables',
      name: 'Variables ENV',
      icon: <Settings className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando configuración...'
    },
    {
      id: 'assistant-id',
      name: 'Assistant ID',
      icon: <User className="w-4 h-4" />,
      status: 'pending',
      message: 'Verificando ID de asistente...'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  const updateCheck = (id: string, updates: Partial<DiagnosticCheck>) => {
    setChecks(prev => prev.map(check => 
      check.id === id ? { ...check, ...updates } : check
    ));
  };

  const checkAdminRole = async (): Promise<void> => {
    updateCheck('admin-role', { status: 'running', message: 'Verificando token y claims...' });

    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Check custom claims first
      const idTokenResult = await user.getIdTokenResult();
      const customClaims = idTokenResult.claims;

      if (customClaims.role === 'admin') {
        updateCheck('admin-role', {
          status: 'success',
          message: 'Rol admin verificado (custom claims)',
          details: `User: ${user.email}, Role: ${customClaims.role}`
        });
        return;
      }

      // Fallback to Firestore check
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        updateCheck('admin-role', {
          status: 'success',
          message: 'Rol admin verificado (Firestore)',
          details: `User: ${user.email}, Firestore role: admin`
        });
        return;
      }

      throw new Error('Usuario sin permisos administrativos');

    } catch (error) {
      updateCheck('admin-role', {
        status: 'error',
        message: 'Error verificando rol admin',
        details: error.message,
        action: 'Contactar administrador para asignar rol admin'
      });
    }
  };

  const checkFirestoreWrite = async (): Promise<void> => {
    updateCheck('firestore-write', { status: 'running', message: 'Probando escritura en Firestore...' });

    try {
      const healthDocRef = doc(db, 'assistants', assistantId, '__health__', 'ping');
      
      // Create test document
      await setDoc(healthDocRef, {
        test: true,
        timestamp: serverTimestamp(),
        createdBy: user?.email || 'unknown',
        assistantId
      });

      // Verify it was created
      const createdDoc = await getDoc(healthDocRef);
      if (!createdDoc.exists()) {
        throw new Error('Documento no fue creado correctamente');
      }

      // Clean up
      await deleteDoc(healthDocRef);

      updateCheck('firestore-write', {
        status: 'success',
        message: 'Escritura en Firestore OK',
        details: `Path: assistants/${assistantId}/__health__/ping`
      });

    } catch (error) {
      updateCheck('firestore-write', {
        status: 'error',
        message: 'Error escribiendo en Firestore',
        details: error.message,
        action: 'Verificar reglas de seguridad en Firestore'
      });
    }
  };

  const checkStorageWrite = async (): Promise<void> => {
    updateCheck('storage-write', { status: 'running', message: 'Probando escritura en Storage...' });

    try {
      const storage = getStorage();
      const testRef = ref(storage, `assistants/${assistantId}/__health__/ping.txt`);
      
      const testContent = `Health check - ${new Date().toISOString()}`;
      
      // Upload test file
      await uploadString(testRef, testContent, 'raw', {
        cacheControl: 'no-store',
        customMetadata: {
          test: 'true',
          assistantId
        }
      });

      // Clean up
      await deleteObject(testRef);

      updateCheck('storage-write', {
        status: 'success',
        message: 'Escritura en Storage OK',
        details: `Path: assistants/${assistantId}/__health__/ping.txt`
      });

    } catch (error) {
      updateCheck('storage-write', {
        status: 'error',
        message: 'Error escribiendo en Storage',
        details: error.message,
        action: 'Verificar reglas de seguridad en Storage'
      });
    }
  };

  const checkFirestoreIndexes = async (): Promise<void> => {
    updateCheck('firestore-indexes', { status: 'running', message: 'Verificando índices...' });

    try {
      // List of required indexes for the syllabus collection
      const requiredIndexes = [
        { collection: 'syllabus', fields: ['assistantId', 'order'], description: 'Para ordenar temas' },
        { collection: 'syllabus', fields: ['assistantId', 'updatedAtMs'], description: 'Para actualizaciones' },
        { collection: 'tests', fields: ['section', 'difficulty'], description: 'Para filtrar tests' },
        { collection: 'flashcards', fields: ['tags'], description: 'Para buscar por tags' }
      ];

      // In a real implementation, we would query Firestore to check if indexes exist
      // For now, we'll just show what's needed
      const missingIndexes = requiredIndexes.filter(() => true); // Assume all are missing for demo

      if (missingIndexes.length === 0) {
        updateCheck('firestore-indexes', {
          status: 'success',
          message: 'Todos los índices están disponibles',
          details: `${requiredIndexes.length} índices verificados`
        });
      } else {
        updateCheck('firestore-indexes', {
          status: 'error',
          message: `Faltan ${missingIndexes.length} índices`,
          details: missingIndexes.map(idx => 
            `${idx.collection}: ${idx.fields.join(', ')} - ${idx.description}`
          ).join('\n'),
          action: 'Crear índices en Firebase Console o usar firestore.indexes.json'
        });
      }

    } catch (error) {
      updateCheck('firestore-indexes', {
        status: 'error',
        message: 'Error verificando índices',
        details: error.message,
        action: 'Revisar configuración de Firestore'
      });
    }
  };

  const checkEnvVariables = async (): Promise<void> => {
    updateCheck('env-variables', { status: 'running', message: 'Verificando ENV...' });

    try {
      const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 
                               process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
                               'No configurado';
      
      const siteUrl = window.location.origin;
      
      const envInfo = {
        'FIREBASE_PROJECT_ID': firebaseProjectId,
        'SITE_URL': siteUrl,
        'NODE_ENV': import.meta.env.MODE || 'unknown'
      };

      const missingVars = Object.entries(envInfo)
        .filter(([key, value]) => !value || value === 'No configurado')
        .map(([key]) => key);

      if (missingVars.length === 0) {
        updateCheck('env-variables', {
          status: 'success',
          message: 'Variables ENV configuradas',
          details: Object.entries(envInfo)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        });
      } else {
        updateCheck('env-variables', {
          status: 'error',
          message: `Faltan ${missingVars.length} variables ENV`,
          details: `Variables faltantes: ${missingVars.join(', ')}`,
          action: 'Configurar variables en .env o deployment'
        });
      }

    } catch (error) {
      updateCheck('env-variables', {
        status: 'error',
        message: 'Error verificando ENV',
        details: error.message
      });
    }
  };

  const checkAssistantId = async (): Promise<void> => {
    updateCheck('assistant-id', { status: 'running', message: 'Verificando Assistant ID...' });

    try {
      if (!assistantId) {
        throw new Error('No hay Assistant ID seleccionado');
      }

      if (assistantId !== 'guardia-civil') {
        updateCheck('assistant-id', {
          status: 'error',
          message: 'Assistant ID incorrecto',
          details: `Esperado: "guardia-civil", Actual: "${assistantId}"`,
          action: 'Seleccionar el asistente correcto en el panel'
        });
        return;
      }

      updateCheck('assistant-id', {
        status: 'success',
        message: 'Assistant ID correcto',
        details: `ID: ${assistantId}, Nombre: ${assistantName}`
      });

    } catch (error) {
      updateCheck('assistant-id', {
        status: 'error',
        message: 'Error verificando Assistant ID',
        details: error.message,
        action: 'Seleccionar un asistente válido'
      });
    }
  };

  const runDiagnostic = async (): Promise<void> => {
    setIsRunning(true);
    
    // Reset all checks to pending
    setChecks(prev => prev.map(check => ({
      ...check,
      status: 'pending' as const,
      message: 'Esperando...',
      details: undefined,
      action: undefined
    })));

    try {
      // Run checks sequentially to avoid overwhelming the system
      await checkAdminRole();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await checkFirestoreWrite();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await checkStorageWrite();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await checkFirestoreIndexes();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await checkEnvVariables();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await checkAssistantId();

      setLastRunTime(new Date());

    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-run on mount
  useEffect(() => {
    runDiagnostic();
  }, [assistantId]);

  const getStatusIcon = (status: DiagnosticCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: DiagnosticCheck['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400">✅ OK</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400">❌ Error</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400">🔄 Ejecutando</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">⏳ Pendiente</Badge>;
    }
  };

  const allChecksSuccess = checks.every(check => check.status === 'success');
  const hasErrors = checks.some(check => check.status === 'error');

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Diagnóstico del Sistema
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastRunTime && (
              <span className="text-xs text-slate-400">
                Última verificación: {lastRunTime.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={runDiagnostic}
              disabled={isRunning}
              size="sm"
              variant="outline"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-center p-4 rounded-lg bg-slate-900/50">
          {allChecksSuccess ? (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-400 font-semibold">✅ Sistema listo para generar contenido</p>
            </div>
          ) : hasErrors ? (
            <div className="text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-400 font-semibold">❌ Errores detectados - revisar configuración</p>
            </div>
          ) : (
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-400 font-semibold">🔄 Ejecutando diagnóstico...</p>
            </div>
          )}
        </div>

        {/* Individual Checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="p-4 rounded-lg bg-slate-900/30 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {check.icon}
                  <span className="font-medium text-slate-200">{check.name}</span>
                  {getStatusIcon(check.status)}
                </div>
                {getStatusBadge(check.status)}
              </div>
              
              <p className="text-sm text-slate-400 mb-2">{check.message}</p>
              
              {check.details && (
                <div className="text-xs text-slate-500 mb-2 font-mono bg-slate-900/50 p-2 rounded whitespace-pre-line">
                  {check.details}
                </div>
              )}
              
              {check.action && (
                <Alert className="mt-2 bg-yellow-500/10 border-yellow-500/30">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300 text-xs">
                    <strong>Acción requerida:</strong> {check.action}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
