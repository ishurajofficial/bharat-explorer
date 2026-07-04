'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/travel-store';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'motion/react';
import { Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useTravelStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (!isMounted || user) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Update local state, this will later be synced to Firestore!
      login(user.displayName || 'Explorer', '🌍');
      
      router.push('/');
    } catch (error: any) {
      console.error("Authentication failed:", error);
      alert("Failed to sign in: " + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="gradient-blob bg-saffron w-[600px] h-[600px] -top-[300px] -right-[200px]" style={{ animationDelay: '0s' }} />
        <div className="gradient-blob bg-india-green w-[500px] h-[500px] -bottom-[200px] -left-[100px]" style={{ animationDelay: '-4s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron via-white to-india-green rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <MapIcon className="w-8 h-8 text-navy" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron via-foreground to-india-green mb-2">
              Bharat Explorer
            </h1>
            <p className="text-muted-foreground text-sm">
              Your personal journey across Incredible India
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold rounded-xl bg-white hover:bg-gray-100 text-black shadow-lg shadow-black/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            >
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
