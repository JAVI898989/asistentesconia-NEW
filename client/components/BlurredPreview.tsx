import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Star } from "lucide-react";
import { useAdminStatus } from "@/hooks/useIsAdmin";

interface BlurredPreviewProps {
  children: React.ReactNode;
  isLocked: boolean;
  title?: string;
  description?: string;
  onUnlock?: () => void;
  unlockButtonText?: string;
  blurLevel?: "light" | "medium" | "heavy";
}

export const BlurredPreview: React.FC<BlurredPreviewProps> = ({
  children,
  isLocked,
  title = "Contenido Premium",
  description = "Suscríbete para desbloquear este contenido",
  onUnlock,
  unlockButtonText = "Desbloquear",
  blurLevel = "medium",
}) => {
  const isAdmin = useAdminStatus();

  // Debug logging
  console.log('🔒 BlurredPreview:', {
    isAdmin,
    isLocked,
    shouldShowContent: isAdmin || !isLocked
  });

  // Admin bypass - always show content for admins
  if (isAdmin || !isLocked) {
    return <>{children}</>;
  }

  const blurClass = {
    light: "blur-sm",
    medium: "blur-md",
    heavy: "blur-lg",
  }[blurLevel];

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className={`${blurClass} pointer-events-none select-none`}>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/90 flex items-end justify-center p-6">
        <div className="text-center bg-slate-800/95 backdrop-blur-sm rounded-lg p-6 border border-slate-700 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-300 text-sm mb-4">{description}</p>

          <div className="space-y-3">
            {onUnlock && (
              <Button
                onClick={onUnlock}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                {unlockButtonText}
              </Button>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>Contenido premium</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Acceso inmediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurredPreview;
