"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

type UpdateProfilePayload = {
  name?: string;
  phone?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  loginAsDev: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with POST /auth/login and persist session/token.
      await simulateDelay(800);
      setUser({
        id: "mock-user",
        name: "Mock User",
        email: payload.email,
        phone: "010-1234-5678",
        role: "ADMIN",
      });
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with POST /auth/signup and handle errors from backend.
      await simulateDelay(900);
      setUser({
        id: "mock-user",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: "CUSTOMER",
      });
    } catch (err) {
      setError("Failed to create account. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!user) {
        throw new Error("No authenticated user.");
      }
      setLoading(true);
      setError(null);
      try {
        // TODO: replace with PATCH /me
        await simulateDelay(600);
        setUser((current) => (current ? { ...current, ...payload } : current));
      } catch (err) {
        setError("Failed to update profile. Please try again.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    // TODO: revoke tokens / clear cookies when backend is ready.
  }, []);

  const loginAsDev = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: gate this helper so it can't run in production builds.
      await simulateDelay(400);
      const devUser: User = {
        id: "dev-admin-id",
        name: "Dev Admin",
        email: "dev.admin@example.com",
        phone: "010-0000-0000",
        role: "ADMIN",
      };
      setUser(devUser);
      console.info("Logged in as dev admin (mock).");
    } catch (err) {
      setError("Failed to login as dev user.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      signup,
      logout,
      updateProfile,
      loginAsDev,
    }),
    [user, loading, error, login, signup, logout, updateProfile, loginAsDev]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
