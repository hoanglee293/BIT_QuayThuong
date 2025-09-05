"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import "@/libs/fontawesome";
import { LangProvider } from "@/lang/LangProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from 'react-hot-toast';


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, getCurrentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: true,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!pathname.includes('/connect') && !pathname.includes('/trading')) {
        try {
          await getCurrentUser();
        } catch (error) {
          router.push('/connect');
        }
      }
    };
    checkAuth();
  }, [pathname, router, getCurrentUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <ThemeProvider>
            {<Header />}
            <main className="bg-white/80 dark:bg-[#000000a8] overflow-x-hidden flex-1 flex">
              {children}
            </main>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                zIndex: 9999,
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
                style: {
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '8px',
                  
                  zIndex: 9999,
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '4px',
                  zIndex: 9999,
                },
              },
            }}
          />
        </ThemeProvider>
      </LangProvider>
    </QueryClientProvider>
  );
} 