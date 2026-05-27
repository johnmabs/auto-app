"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { authenticate } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [state, formAction, pending] = React.useActionState(
    authenticate,
    undefined,
  );

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);

  React.useEffect(() => {
    if (state?.error) {
      toast.error("Connexion échouée");
    }
  }, [state?.error]);

  const inputCls = (hasIcon = false) =>
    cn(
      "w-full bg-[var(--bg-3)] border border-[var(--border)] rounded-[var(--r)]",
      "py-3 text-[0.9rem] text-[var(--text)] placeholder:text-[var(--dim)]",
      "outline-none transition-colors duration-150",
      "focus:border-[var(--gold)]",
      hasIcon ? "pl-10 pr-4" : "px-4",
    );

  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04)_0%,transparent_60%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="w-2 h-2 rounded-full bg-(--accent)"
              aria-hidden="true"
            />
            <span className="font-display text-[1.6rem] tracking-[0.08em] text-(--gold)">
              AUTOSTORE
              <span className="text-(--dim) opacity-50 mx-0.5">·</span>
              <span className="text-(--text)">CG</span>
            </span>
          </div>
          <p className="text-[0.82rem] text-(--muted)">
            Administration — Connexion requise
          </p>
        </div>

        {/* Card */}
        <div className="bg-(--bg-2) border border-(--border-2) rounded-(--r-xl) p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <h1 className="font-display text-[1.8rem] tracking-[0.04em] mb-1">
            CONNEXION
          </h1>
          <p className="text-[0.8rem] text-(--muted) mb-6">
            Accédez au tableau de bord
          </p>

          {/* Error */}
          {state?.error && (
            <div
              className="mb-4 px-4 py-3 bg-[rgba(230,57,70,0.08)] border border-[rgba(230,57,70,0.3)] rounded-(--r) text-(--accent) text-[0.82rem]"
              role="alert"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4" noValidate>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--dim)"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autostore-cg.com"
                  autoComplete="email"
                  required
                  className={inputCls(true)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--dim)"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={cn(inputCls(true), "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--dim) hover:text-(--muted) transition-colors"
                  aria-label={
                    showPwd
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending || !email || !password}
              className={cn(
                "w-full h-11 rounded-(--r) font-sans font-semibold text-[0.85rem] uppercase tracking-wider",
                "transition-all duration-200",
                pending || !email || !password
                  ? "bg-(--bg-4) text-(--dim) cursor-not-allowed"
                  : "bg-(--gold) text-(--bg) hover:bg-(--gold-2) hover:-translate-y-px",
              )}
              aria-busy={pending}
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-(--bg) border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Connexion…
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-5 text-[0.75rem] text-(--dim)">
          <Link href="/" className="hover:text-(--gold) transition-colors">
            ← Retour au site public
          </Link>
        </p>
      </div>
    </div>
  );
}
