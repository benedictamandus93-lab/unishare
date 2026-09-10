"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMAIL_DOMAIN_MESSAGE } from "@/lib/constants";
import { friendlyError, isUniversityEmail } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

export function AuthForm({
  mode,
  next = "/account",
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const { supabase } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (isRegister && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    // First gate. The database repeats the same check on the server.
    if (!isUniversityEmail(email)) {
      setError(EMAIL_DOMAIN_MESSAGE);
      return;
    }
    if (isRegister && password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    setBusy(true);
    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signUpError) {
          setError(friendlyError(signUpError.message));
          return;
        }
        router.push("/auth/verify");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        setError(friendlyError(signInError.message));
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="sheet space-y-4 p-6">
      <div>
        <h1 className="font-display text-[26px] font-bold">
          {isRegister ? "Create your UniShare account" : "Log in to UniShare"}
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">
          {isRegister
            ? "Register with your University of Auckland email."
            : "Browsing is open to everyone. Log in when you want to post."}
        </p>
      </div>

      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}

      {isRegister && (
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Sarah Whitcombe"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          University email
        </label>
        <input
          id="email"
          type="email"
          className="field"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@aucklanduni.ac.nz"
        />
        {isRegister && (
          <p className="mt-1.5 text-[13px] text-ink-faint">
            Only @auckland.ac.nz and @aucklanduni.ac.nz addresses are accepted.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="field"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder={isRegister ? "At least 8 characters" : ""}
        />
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy
          ? "Working"
          : isRegister
            ? "Create account"
            : "Log in"}
      </button>

      <p className="text-center text-[14px] text-ink-soft">
        {isRegister ? (
          <>
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-varsity underline underline-offset-4">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-varsity underline underline-offset-4">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
