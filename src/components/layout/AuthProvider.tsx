"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database";

export type Profile = Pick<
  Tables<"profiles">,
  "id" | "name" | "email" | "role" | "avatar_url"
>;

type AuthContextValue = {
  profile?: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVolunteer: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
  profile?: Profile | null;
};

export function AuthProvider({ children, profile }: AuthProviderProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async (nextUser?: User | null) => {
      if (nextUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, name, email, role, avatar_url")
          .eq("id", nextUser.id)
          .single();

        if (profile) {
          setCurrentProfile({
            ...profile,
            avatar_url:
              profile.avatar_url || nextUser.user_metadata?.avatar_url,
          });
        }
      } else {
        setCurrentProfile(null);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const isAdmin = currentProfile?.role === "admin";
  const isVolunteer = currentProfile?.role === "volunteer";

  const signOut = useCallback(async () => {
    await supabase.auth.signOut({ scope: "local" });
    router.refresh();
  }, [router, supabase.auth]);

  const value = useMemo(
    () => ({
      profile: currentProfile,
      isAuthenticated: Boolean(currentProfile),
      isAdmin,
      isVolunteer,
      signOut,
    }),
    [currentProfile, isAdmin, isVolunteer, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
