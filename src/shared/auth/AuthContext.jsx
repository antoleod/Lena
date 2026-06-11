import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthChange, signOutUser } from '../../services/firebase/authService.js';
import { pullFromCloud, pushToCloud, startAutoSync } from '../../services/firebase/syncService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null = loading, false = guest, object = Firebase user
  const [user, setUser]       = useState(null);
  const [syncing, setSyncing] = useState(false);
  const stopSyncRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      // Stop previous auto-sync if any
      if (stopSyncRef.current) {
        stopSyncRef.current();
        stopSyncRef.current = null;
      }

      if (firebaseUser) {
        setSyncing(true);
        try {
          await pullFromCloud(firebaseUser.uid);
        } catch { /* offline — use local data */ }
        setSyncing(false);

        // Start auto-sync for this session
        stopSyncRef.current = startAutoSync(firebaseUser.uid);
        setUser(firebaseUser);
      } else {
        setUser(false);   // false = confirmed guest/logged-out
      }
    });

    return () => {
      unsubscribe();
      if (stopSyncRef.current) stopSyncRef.current();
    };
  }, []);

  async function logout() {
    if (user) {
      try { await pushToCloud(user.uid); } catch { /* offline */ }
    }
    await signOutUser();
  }

  async function syncNow() {
    if (!user) return;
    setSyncing(true);
    try { await pushToCloud(user.uid); } catch { /* offline */ }
    setSyncing(false);
  }

  return (
    <AuthContext.Provider value={{ user, syncing, logout, syncNow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
