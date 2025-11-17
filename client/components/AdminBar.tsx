import { useAdminInfo } from "@/hooks/useIsAdmin";

interface AdminBarProps {
  assistantId?: string;
  assistantName?: string;
  paywallBypassed?: boolean;
}

export function AdminBar({ assistantId, assistantName, paywallBypassed = true }: AdminBarProps) {
  const { isAdmin } = useAdminInfo();

  if (!isAdmin) return null;

  return <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-b border-red-500" />;
}

export default AdminBar;
