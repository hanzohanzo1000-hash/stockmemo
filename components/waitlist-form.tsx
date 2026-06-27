"use client";

import { ja } from "@/lib/i18n/ja";
import { FormEvent, useState } from "react";

type WaitlistFormProps = {
  source?: string;
  variant?: "hero" | "cta";
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm({
  source = "hero",
  variant = "hero",
}: WaitlistFormProps) {
  const t = ja.waitlist;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? t.errorGeneric);
        return;
      }

      setStatus("success");
      setMessage(t.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div
        className={
          variant === "hero"
            ? "flex flex-col items-center gap-3 text-center"
            : "mx-auto max-w-md text-center"
        }
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {message}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        variant === "hero"
          ? "flex w-full max-w-md flex-col items-center gap-4"
          : "mx-auto mt-8 max-w-md"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <label htmlFor={`waitlist-email-${source}`} className="sr-only">
          {t.emailLabel}
        </label>
        <input
          id={`waitlist-email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "loading"}
          className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all hover:opacity-90 hover:shadow-[0_0_60px_rgba(255,255,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t.submitting : t.submit}
        </button>
      </form>

      {status === "error" ? (
        <p className="text-sm text-red-400">{message}</p>
      ) : (
        <p className="text-sm text-white/35">{t.hint}</p>
      )}
    </div>
  );
}
