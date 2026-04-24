import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
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
  joinCode: string;
  isOwner: boolean;
  createdBy: string;
}

interface AuthContextType {
  isSignedIn: boolean;
  displayName: string;
  email: string;
  role: string;
  spaces: Space[];
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName: string, role: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  addSpace: (space: Omit<Space, 'id' | 'joinCode' | 'isOwner'>) => Promise<void>;
  joinSpace: (joinCode: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  displayName: '',
  email: '',
  role: '',
  spaces: [],
  signIn: async () => null,
  signUp: async () => null,
  signInWithGoogle: async () => null,
  signOut: async () => {},
  addSpace: async () => {},
  joinSpace: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  function rowToSpace(row: any, isOwner: boolean): Space {
    return {
      id: row.id,
      name: row.name,
      pricePerProduct: row.price_per_product ?? '',
      pricePerProductPerDay: row.price_per_product_per_day ?? '',
      retailer: row.retailer ?? '',
      description: row.description ?? '',
      displayImage: row.display_image ?? null,
      timeCreated: row.time_created,
      joinCode: row.join_code ?? '',
      isOwner,
      createdBy: row.created_by ?? '',
    };
  }

  async function loadSpaces(uid: string) {
    const [ownedRes, joinedRes] = await Promise.all([
      supabase.from('workspaces').select('*').eq('user_id', uid).order('time_created', { ascending: true }),
      supabase.from('workspace_members').select('workspaces(*)').eq('user_id', uid),
    ]);

    const owned: Space[] = (ownedRes.data ?? []).map((row) => rowToSpace(row, true));
    const ownedIds = new Set(owned.map((s) => s.id));

    const joined: Space[] = (joinedRes.data ?? [])
      .map((row: any) => row.workspaces)
      .filter((ws: any) => ws && !ownedIds.has(ws.id))
      .map((ws: any) => rowToSpace(ws, false));

    setSpaces([...owned, ...joined]);
  }

  async function applySession(session: Session) {
    const meta = session.user.user_metadata;
    setIsSignedIn(true);
    setUserId(session.user.id);
    setEmail(session.user.email ?? '');
    setDisplayName(meta?.display_name ?? meta?.full_name ?? session.user.email?.split('@')[0] ?? '');
    setRole(meta?.role ?? '');
    await loadSpaces(session.user.id);
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
        setUserId(null);
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
    if (!error && data.session) await applySession(data.session);
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
        await applySession(data.session);
      } else {
        setDisplayName(name);
        setEmail(userEmail);
        setRole(userRole);
      }
    }
    return error ? error.message : null;
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<string | null> => {
    try {
      const redirectUrl = Linking.createURL('/');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
      });
      if (error) return error.message;
      if (!data.url) return 'No OAuth URL returned';

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      if (result.type !== 'success') return 'cancelled';

      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code as string | undefined;
      if (code) {
        const { data: sd, error: se } = await supabase.auth.exchangeCodeForSession(code);
        if (se) return se.message;
        if (sd.session) await applySession(sd.session);
        return null;
      }

      const fragment = new URLSearchParams(result.url.split('#')[1] ?? '');
      const accessToken = fragment.get('access_token');
      const refreshToken = fragment.get('refresh_token');
      if (accessToken && refreshToken) {
        const { data: sd, error: se } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (se) return se.message;
        if (sd.session) await applySession(sd.session);
        return null;
      }

      return 'Could not extract session from redirect URL';
    } catch (err: any) {
      return err?.message ?? 'Google sign-in failed';
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  function generateJoinCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  const addSpace = useCallback(async (space: Omit<Space, 'id' | 'joinCode' | 'isOwner'>) => {
    if (!userId) return;
    const joinCode = generateJoinCode();
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        user_id: userId,
        name: space.name,
        price_per_product: space.pricePerProduct,
        price_per_product_per_day: space.pricePerProductPerDay,
        retailer: space.retailer,
        description: space.description,
        display_image: space.displayImage,
        time_created: space.timeCreated,
        join_code: joinCode,
        created_by: displayName,
      })
      .select()
      .single();

    if (!error && data) {
      setSpaces((prev) => [...prev, rowToSpace(data, true)]);
    }
  }, [userId]);

  const joinSpace = useCallback(async (joinCode: string): Promise<string | null> => {
    if (!userId) return 'Not signed in';
    const { data: ws, error: wsError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('join_code', joinCode.toUpperCase().trim())
      .single();
    if (wsError || !ws) return 'Workspace not found';
    if (ws.user_id === userId) return 'You already own this workspace';

    const { error: memberError } = await supabase
      .from('workspace_members')
      .upsert({ workspace_id: ws.id, user_id: userId }, { onConflict: 'workspace_id,user_id' });
    if (memberError) return memberError.message;

    setSpaces((prev) => {
      if (prev.some((s) => s.id === ws.id)) return prev;
      return [...prev, rowToSpace(ws, false)];
    });
    return null;
  }, [userId]);

  return (
    <AuthContext.Provider value={{ isSignedIn, displayName, email, role, spaces, signIn, signUp, signInWithGoogle, signOut, addSpace, joinSpace }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
