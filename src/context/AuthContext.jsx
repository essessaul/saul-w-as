import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, getSession, signIn as signInService, signOut as signOutService, signUp as signUpService } from "../services/authService";
import { hasSupabase, supabase } from "../lib/supabase";

const AuthContext = createContext(null);
const DEMO_LOGIN = "SaulPlaya";
const DEMO_PASSWORD = "Formula5181";
const DEMO_STORAGE_KEY = "pevh_demo_admin_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!hasSupabase) {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (stored && mounted) {
          setSession({
            user: {
              id: "demo-admin-user",
              email: "admin@playa.com",
              user_metadata: { role: "admin", display_name: "Saul Playa" },
            },
          });
          setProfile({
            id: "demo-admin-user",
            email: "admin@playa.com",
            display_name: "Saul Playa",
            role: "admin",
          });
        }
        if (mounted) setLoading(false);
        return;
      }

      const current = await getSession();
      if (!mounted) return;
      setSession(current);
      if (current?.user?.id) {
        const prof = await getProfile(current.user.id);
        if (mounted) {
          setProfile(prof || {
            id: current.user.id,
            email: current.user.email,
            display_name: current.user.user_metadata?.display_name || "User",
            role: current.user.user_metadata?.role || "guest",
          });
        }
      }
      setLoading(false);
    }

    load();

    if (hasSupabase && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user?.id) {
          const prof = await getProfile(newSession.user.id);
          setProfile(prof || {
            id: newSession.user.id,
            email: newSession.user.email,
            display_name: newSession.user.user_metadata?.display_name || "User",
            role: newSession.user.user_metadata?.role || "guest",
          });
        } else {
          setProfile(null);
        }
      });
      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    loading,
    async signIn(email, password) {
      if (!hasSupabase) {
        if (email === DEMO_LOGIN && password === DEMO_PASSWORD) {
          localStorage.setItem(DEMO_STORAGE_KEY, "1");
          const demoSession = {
            user: {
              id: "demo-admin-user",
              email: "admin@playa.com",
              user_metadata: { role: "admin", display_name: "Saul Playa" },
            },
          };
          const demoProfile = {
            id: "demo-admin-user",
            email: "admin@playa.com",
            display_name: "Saul Playa",
            role: "admin",
          };
          setSession(demoSession);
          setProfile(demoProfile);
          return { error: null, data: demoSession };
        }
        return { error: new Error("Invalid login. Use SaulPlaya / Formula5181.") };
      }
      return signInService(email, password);
    },
    async signUp(email, password, role, displayName) {
      if (!hasSupabase) {
        return { error: new Error("Signup requires Supabase. Demo admin login is SaulPlaya / Formula5181.") };
      }
      return signUpService(email, password, role, displayName);
    },
    async signOut() {
      if (!hasSupabase) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        setSession(null);
        setProfile(null);
        return;
      }
      await signOutService();
      setSession(null);
      setProfile(null);
    }
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
