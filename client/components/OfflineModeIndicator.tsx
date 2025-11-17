import React from "react";

export const OfflineModeIndicator: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-600 text-white text-center py-1 px-4">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>📱 MODO OFFLINE FORZADO - Sin conexión de red</span>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default OfflineModeIndicator;
