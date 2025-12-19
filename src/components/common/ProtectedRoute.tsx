import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { address, isConnecting } = useWallet();

  // Show loading while checking connection
  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking wallet connection..." />
      </div>
    );
  }

  // Redirect to home if not connected
  if (!address) {
    return <Navigate to="/" replace />;
  }

  // Render protected content
  return <>{children}</>;
}
