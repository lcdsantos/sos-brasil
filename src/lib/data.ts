import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getEvento = cache(async function getEvento({
  eventoSlug,
}: {
  eventoSlug: string;
}) {
  const supabase = await createClient();

  const { data: evento } = await supabase
    .from("eventos")
    .select("*")
    .eq("slug", eventoSlug)
    .single();

  return evento;
});

export const getProfile = cache(async function getProfile() {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();

  const [userId, userMetaData] = await (async () => {
    if (typeof claims?.claims.sub === "string") {
      return [claims.claims.sub, claims?.claims.user_metadata];
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return [user?.id, user?.user_metadata];
    }
  })();

  const { data: profile } = userId
    ? await supabase
        .from("profiles")
        .select("id, name, email, role, avatar_url")
        .eq("id", userId)
        .single()
    : { data: null };

  if (profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar_url:
        profile.avatar_url ||
        (userMetaData?.avatar_url as string | undefined) ||
        null,
    };
  }
});
