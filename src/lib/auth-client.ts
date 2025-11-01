import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
});

export const { signUp, signIn, signOut, useSession } = client;

client.$store.listen("$sessionSignal", async () => {});
