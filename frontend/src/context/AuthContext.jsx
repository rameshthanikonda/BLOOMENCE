// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
// 🛑 IMPORTANT: Update this path to where you define Firebase Auth
import { auth } from "../firebaseConfig"; 
import { onAuthStateChanged } from 'firebase/auth';
import { registerEmail, seen } from '../api/notifications';
import { connectRealtime } from '../realtime';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listens for authentication state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    let socket;
    (async () => {
      if (!currentUser) return;
      try { await registerEmail(currentUser.displayName || 'User', currentUser.email); } catch (e) { console.error('registerEmail failed', e); }
      try { await seen(); } catch (e) { console.error('seen failed', e); }
      try { socket = await connectRealtime(); } catch (e) { console.error('connectRealtime failed', e); }
    })();
    return () => { if (socket) socket.close(); };
  }, [currentUser?.uid]);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};