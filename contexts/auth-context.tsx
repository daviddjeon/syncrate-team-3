import React, { createContext, useContext, useState, useCallback } from 'react';

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
  signIn: (name: string, email: string, role?: string) => void;
  signOut: () => void;
  addSpace: (space: Omit<Space, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  displayName: '',
  email: '',
  role: '',
  spaces: [],
  signIn: () => {},
  signOut: () => {},
  addSpace: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [spaces, setSpaces] = useState<Space[]>([]);

  const signIn = useCallback((name: string, userEmail: string, userRole?: string) => {
    setDisplayName(name);
    setEmail(userEmail);
    setRole(userRole ?? '');
    setIsSignedIn(true);
    // Auto-create a default space if user has none
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
  }, []);

  const signOut = useCallback(() => {
    setIsSignedIn(false);
    setDisplayName('');
    setEmail('');
    setRole('');
    setSpaces([]);
  }, []);

  const addSpace = useCallback((space: Omit<Space, 'id'>) => {
    setSpaces((prev) => [
      ...prev,
      { ...space, id: String(prev.length + 1) },
    ]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isSignedIn, displayName, email, role, spaces, signIn, signOut, addSpace }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
