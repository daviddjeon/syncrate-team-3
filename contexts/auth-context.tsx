import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface Space {
  id: string;
  name: string;
  pricePerProduct: string;
  pricePerProductPerDay: string;
  retailer: string;
  description: string;
  displayImage: string | null;
  timeCreated: string;
}

interface AuthContextType {
  isSignedIn: boolean;
  displayName: string;
  email: string;
  role: string;
  spaces: Space[];
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName: string, role: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  addSpace: (space: Omit<Space, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  displayName: '',
  email: '',
  role: '',
  spaces: [],
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  addSpace: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [spaces, setSpaces] = useState<Space[]>([]);

  function applySession(session: Session) {
    const meta = session.user.user_metadata;
    setIsSignedIn(true);
    setEmail(session.user.email ?? '');
    setDisplayName(meta?.display_name ?? session.user.email?.split('@')[0] ?? '');
    setRole(meta?.role ?? '');
    setSpaces((prev) =>
      prev.length === 0
        ? [{
            id: '1',
            name: 'Space 1',
            pricePerProduct: '',
            pricePerProductPerDay: '',
            retailer: '',
            description: '',
            displayImage: null,
            timeCreated: new Date().toISOString(),
          }]
        : prev
    );
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) applySession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        applySession(session);
      } else {
        setIsSignedIn(false);
        setDisplayName('');
        setEmail('');
        setRole('');
        setSpaces([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (userEmail: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: userEmail, password });
    if (!error && data.session) applySession(data.session);
    return error ? error.message : null;
  }, []);

  const signUp = useCallback(async (
    userEmail: string,
    password: string,
    name: string,
    userRole: string
  ): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: { data: { display_name: name, role: userRole } },
    });
    if (!error) {
      if (data.session) {
        applySession(data.session);
      } else {
        // Email confirmation required — pre-populate display name and email
        setDisplayName(name);
        setEmail(userEmail);
        setRole(userRole);
      }
    }
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const addSpace = useCallback((space: Omit<Space, 'id'>) => {
    setSpaces((prev) => [
      ...prev,
      { ...space, id: String(prev.length + 1) },
    ]);
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, displayName, email, role, spaces, signIn, signUp, signOut, addSpace }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
