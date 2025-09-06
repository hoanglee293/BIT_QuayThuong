'use client'; 

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Lotterys from './lotterys/LotteryPage';
import { useAuth } from '@/hooks/useAuth';

function HomeContent() {
  const { isAuthenticated, isLoading, checkAuthFromStorage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication from localStorage on component mount
    const checkAuth = async () => {
      await checkAuthFromStorage();
    };
    checkAuth();
  }, [checkAuthFromStorage]);

  useEffect(() => {
    // Redirect to connect page if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push('/connect');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading or nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return <div></div>;
  }

  return (
    <>
      <Lotterys />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <HomeContent />
    </Suspense>
  );
}
