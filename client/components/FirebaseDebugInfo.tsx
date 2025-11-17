import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FirebaseError {
  timestamp: string;
  message: string;
  code?: string;
  name?: string;
  stack?: string;
}

const FirebaseDebugInfo: React.FC = () => {
  const [errors, setErrors] = useState<FirebaseError[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console.error to capture Firebase errors
    const originalConsoleError = console.error;
    
    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Check if this is a Firebase error
      const errorString = args.join(' ');
      if (errorString.includes('🔥') || errorString.includes('Firebase')) {
        const errorInfo: FirebaseError = {
          timestamp: new Date().toISOString(),
          message: errorString,
        };
        
        // Try to extract more details if args contain objects
        args.forEach(arg => {
          if (typeof arg === 'object' && arg !== null) {
            if (arg.code) errorInfo.code = arg.code;
            if (arg.name) errorInfo.name = arg.name;  
            if (arg.message) errorInfo.message = arg.message;
            if (arg.stack) errorInfo.stack = arg.stack.split('\n')[0];
          }
        });
        
        setErrors(prev => [errorInfo, ...prev.slice(0, 9)]); // Keep last 10 errors
      }
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Import Firebase functions
      const { auth, db } = await import('@/lib/firebase');
      const { collection, getDocs } = await import('firebase/firestore');
      
      console.log('🔥 Testing Firebase connection...');
      
      // Test Firestore connection
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      
      console.log('✅ Firebase connection successful');
    } catch (error) {
      console.error('🔥 Firebase connection test failed:', error);
    }
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        🔥 Debug Firebase
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          🔥 Firebase Debug
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
          >
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={testFirebaseConnection} size="sm" className="w-full">
          Test Connection
        </Button>
        
        <Button 
          onClick={() => setErrors([])} 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          Clear Errors ({errors.length})
        </Button>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-semibold">Recent Firebase Errors:</h4>
          {errors.length === 0 ? (
            <p className="text-xs text-muted-foreground">No Firebase errors detected</p>
          ) : (
            errors.map((error, index) => (
              <div key={index} className="border p-2 rounded text-xs">
                <div className="text-xs text-muted-foreground">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </div>
                {error.code && (
                  <div><strong>Code:</strong> {error.code}</div>
                )}
                {error.name && (
                  <div><strong>Name:</strong> {error.name}</div>
                )}
                <div><strong>Message:</strong> {error.message}</div>
                {error.stack && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {error.stack}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseDebugInfo;
