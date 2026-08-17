import { AuthInterceptor } from "@/modules/auth/components/AuthInterceptor";
import { AuthSessionCoordinator } from "@/modules/auth/components/AuthSessionCoodinator";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <AuthSessionCoordinator>
        <AuthInterceptor />
        {children}
      </AuthSessionCoordinator>
    </AuthProvider>
  );
}
