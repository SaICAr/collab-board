"use client";

import { usePathname } from "next/navigation";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { setDefaultOptions } from "date-fns";
import { zhCN as dateFnsZhCN } from "date-fns/locale";
import { zhCN } from "@clerk/localizations";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";

import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

setDefaultOptions({ locale: dateFnsZhCN });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({ children }: ConvexClientProviderProps) => {
  const pathname = usePathname();

  const isPublicRoute = (pathname: string) => {
    const regex = /^\/(sign-in|sign-up)(\/.*)?$/;

    return regex.test(pathname);
  };

  return (
    <ClerkProvider localization={zhCN}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {isPublicRoute(pathname) ? (
          <Unauthenticated>{children}</Unauthenticated>
        ) : (
          <Authenticated>{children}</Authenticated>
        )}
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
