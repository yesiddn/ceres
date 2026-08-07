import { AuthInterceptor } from "@/modules/auth/components/AuthInterceptor";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";
import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <AuthInterceptor />
      {children}
    </AuthProvider>
  );
}
