'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useTravelStore } from '@/store/travel-store';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { login, logout, syncFromCloud } = useTravelStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User logged in
        login(firebaseUser.displayName || 'Explorer', '🌍', firebaseUser.uid, firebaseUser.email, firebaseUser.photoURL);
        
        // Fetch existing data from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        
        // Set up real-time listener for cloud changes
        const unsubSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            syncFromCloud(data);
          } else {
            // First time login, save current local state to cloud
            const state = useTravelStore.getState();
            setDoc(docRef, {
              visitedStates: Array.from(state.visitedStates),
              wishlistStates: Array.from(state.wishlistStates),
              travelNotes: state.travelNotes,
              user: state.user
            }, { merge: true });
          }
          setIsLoading(false);
        });
        
        return () => unsubSnapshot();
      } else {
        // User logged out
        logout();
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [login, logout, syncFromCloud]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-saffron animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
