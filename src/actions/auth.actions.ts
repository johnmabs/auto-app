"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";

export type AuthState = {
  error?: string;
  success?: boolean;
};

function getSafeCallbackUrl(value: FormDataEntryValue | null) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/admin";
  }

  return value;
}

export async function authenticate(
  _prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState | undefined> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  const parsed = loginSchema.safeParse({
    email,
    password,
  });

  if (!parsed.success) {
    return {
      error: "Veuillez renseigner un email et un mot de passe valides.",
      success: false,
    };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou mot de passe incorrect.", success: false };
        default:
          return { error: "Erreur de connexion. Réessayez.", success: false };
      }
    }
    throw error;
  }
}
