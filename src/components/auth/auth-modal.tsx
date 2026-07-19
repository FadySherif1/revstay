"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-provider";
import { signUp, signInWithCredentials } from "@/actions/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthModal({ googleEnabled }: { googleEnabled: boolean }) {
  const t = useTranslations("auth");
  const prefersReducedMotion = useReducedMotion();
  const { isOpen, tab, setTab, openAuth, closeAuth, onAuthSuccess } = useAuthModal();
  const { update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isSignUp = tab === "signup";

  // Reset transient state whenever the modal opens or the tab changes.
  useEffect(() => {
    if (isOpen) {
      setFieldError(null);
      setFormError(null);
      setBusy(false);
      const id = setTimeout(() => firstFieldRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [isOpen, tab]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuth();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeAuth]);

  // NextAuth redirects back to "/" with ?error=... when a Google sign-in
  // can't complete — most commonly OAuthAccountNotLinked, which fires when
  // that email already has a password-based account (we don't auto-link
  // them; see auth.config.ts). Surface it as a friendly message and drop
  // straight into the sign-in tab, then strip the param from the URL.
  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    openAuth("signin");
    setFormError(
      error === "OAuthAccountNotLinked"
        ? t("errors.accountNotLinked")
        : t("errors.generic")
    );

    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function validate(): boolean {
    if (isSignUp && name.trim().length < 2) {
      setFieldError(t("errors.nameShort"));
      return false;
    }
    if (!EMAIL_RE.test(email)) {
      setFieldError(t("errors.emailInvalid"));
      return false;
    }
    if (isSignUp && !(password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password))) {
      setFieldError(t("errors.passwordWeak"));
      return false;
    }
    if (!isSignUp && password.length < 1) {
      setFieldError(t("errors.invalidCredentials"));
      return false;
    }
    setFieldError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !validate()) return;
    setFormError(null);
    setBusy(true);

    try {
      if (isSignUp) {
        const res = await signUp({ name: name.trim(), email, password });
        if (!res.ok) {
          setBusy(false);
          if (res.field === "email" && res.error.includes("exists")) {
            setFormError(t("errors.emailTaken"));
          } else if (res.error.includes("Too many")) {
            setFormError(t("errors.rateLimited"));
          } else {
            setFormError(t("errors.generic"));
          }
          return;
        }
      }
      // Sign in (for both sign-up-then-login and direct sign-in).
      const res = await signInWithCredentials({ email, password });
      if (!res.ok) {
        setBusy(false);
        setFormError(
          res.error.includes("Too many")
            ? t("errors.rateLimited")
            : t("errors.invalidCredentials")
        );
        return;
      }
      // Refresh the client session so useSession() reflects the new state,
      // then resume any pending intent (e.g. open the booking modal).
      await updateSession();
      onAuthSuccess();
    } catch {
      setBusy(false);
      setFormError(t("errors.generic"));
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isSignUp ? t("createAccount") : t("signIn")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeAuth}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="scrollbar-slim relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-ink/10 bg-white-soft px-7 pb-7 pt-14 shadow-[var(--shadow-warm)]"
          >
            <motion.button
              type="button"
              aria-label={t("closeAuth")}
              onClick={closeAuth}
              whileHover={prefersReducedMotion ? undefined : { rotate: 90 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group absolute top-4 flex h-11 w-11 items-center justify-center rounded-full text-ink-mute transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 ltr:right-4 rtl:left-4"
            >
              <span
                aria-hidden
                className="absolute inset-0 scale-75 rounded-full bg-ink/5 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
              />
              <X className="relative h-5 w-5" strokeWidth={2} />
            </motion.button>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-full bg-ink/5 p-1">
              {(["signin", "signup"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={tab === key}
                  className="relative flex-1 rounded-full py-2.5 text-sm font-semibold"
                >
                  {tab === key && (
                    <motion.span
                      layoutId="auth-tab"
                      transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gold-500 shadow-[var(--shadow-warm-sm)]"
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      tab === key ? "text-gold-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {key === "signin" ? t("signIn") : t("createAccount")}
                  </span>
                </button>
              ))}
            </div>

            {googleEnabled && (
              <>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-[#1f1f1f] transition-shadow hover:shadow-[var(--shadow-warm-sm)]"
                >
                  <GoogleGlyph />
                  {t("google")}
                </button>
                <div className="my-5 flex items-center gap-3 text-xs text-ink-mute">
                  <span className="h-px flex-1 bg-ink/10" />
                  {t("or")}
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignUp && (
                <FloatingField
                  ref={firstFieldRef}
                  id="auth-name"
                  label={t("name")}
                  type="text"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
              )}
              <FloatingField
                ref={isSignUp ? undefined : firstFieldRef}
                id="auth-email"
                label={t("email")}
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                dir="ltr"
              />
              <div className="relative">
                <FloatingField
                  id="auth-password"
                  label={t("password")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  dir="ltr"
                />
                <button
                  type="button"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-3.5 text-ink-mute hover:text-ink ltr:right-3 rtl:left-3"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {(fieldError || formError) && (
                <p role="alert" className="rounded-lg bg-error-bg px-3 py-2 text-sm text-error-fg">
                  {fieldError ?? formError}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-semibold text-gold-ink transition-transform hover:scale-[1.01] hover:bg-gold-400 disabled:cursor-wait disabled:opacity-70"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
                {busy
                  ? isSignUp ? t("creating") : t("signingIn")
                  : isSignUp ? t("createCta") : t("signInCta")}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-soft">
              {isSignUp ? t("haveAccount") : t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => setTab(isSignUp ? "signin" : "signup")}
                className="font-semibold text-gold-600 hover:underline"
              >
                {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { forwardRef } from "react";

type FieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
};

const FloatingField = forwardRef<HTMLInputElement, FieldProps>(function FloatingField(
  { id, label, type, value, onChange, autoComplete, dir },
  ref
) {
  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        dir={dir}
        placeholder=" "
        className="peer w-full rounded-xl border border-ink/15 bg-ivory px-3.5 pb-2 pt-5 text-sm text-ink transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-3.5 text-sm text-ink-mute transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-gold-600 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs ltr:left-3.5 rtl:right-3.5"
      >
        {label}
      </label>
    </div>
  );
});

function GoogleGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
