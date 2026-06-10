"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { MessageIcon, PhoneIcon } from "@/components/icons";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/i18n";

export function QuoteSection() {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const message = data.get("message") as string;

    try {
      const response = await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message, lang }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      setSubmitted(true);
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "h-12 w-full border border-border-dark bg-surface-dark-2 px-4 text-base text-white placeholder:text-neutral-500 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-ring";

  return (
    <section id="quote" className="scroll-mt-28 bg-surface-dark text-on-dark">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div>
          <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-red">
            {t.quote.heading}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
            {t.quote.title}
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-on-dark-muted">
            {t.quote.desc}
          </p>

          <p className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.2em] text-on-dark-muted">
            {t.quote.orCall}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex h-13 items-center justify-center gap-2.5 bg-white px-6 font-display text-base font-semibold uppercase tracking-wide text-foreground transition-colors duration-150 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PhoneIcon className="h-5 w-5 text-red" />
              {t.quote.call} {PHONE_DISPLAY}
            </a>
            <a
              href={`sms:${PHONE_TEL}`}
              className="inline-flex h-13 items-center justify-center gap-2.5 border-2 border-white px-6 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-white hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageIcon className="h-5 w-5" />
              {t.quote.text}
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:pt-2">
          {/* Honeypot field — invisible to users, catches bots */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="quote-name"
                className="mb-2 block font-display text-sm font-semibold uppercase tracking-wider"
              >
                {t.quote.nameLabel}{" "}
                <span aria-hidden="true" className="text-red">*</span>
              </label>
              <input
                id="quote-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={t.quote.namePlaceholder}
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="quote-phone"
                className="mb-2 block font-display text-sm font-semibold uppercase tracking-wider"
              >
                {t.quote.phoneLabel}{" "}
                <span aria-hidden="true" className="text-red">*</span>
              </label>
              <input
                id="quote-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder={t.quote.phonePlaceholder}
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="quote-message"
                className="mb-2 block font-display text-sm font-semibold uppercase tracking-wider"
              >
                {t.quote.messageLabel}
              </label>
              <textarea
                id="quote-message"
                name="message"
                rows={4}
                placeholder={t.quote.messagePlaceholder}
                className="w-full border border-border-dark bg-surface-dark-2 px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading || submitted}
              className="h-14 cursor-pointer bg-red font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-red-dark disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {loading ? "Sending..." : submitted ? "✓ Sent" : t.quote.submit}
            </button>
            {error && (
              <p role="alert" className="text-sm font-medium text-red-300">
                {error}
              </p>
            )}
            {submitted && (
              <p role="status" className="text-sm font-medium text-neutral-200">
                {t.quote.success}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
