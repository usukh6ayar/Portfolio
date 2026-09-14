"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * Where a submission goes. Set NEXT_PUBLIC_FORM_ENDPOINT to a Formspree (or
 * equivalent) form URL and the form posts there over fetch, so the visitor
 * never leaves the page. Left unset — which is how this ships until the form
 * is created — it composes the same fields into a mailto: instead. Either way
 * the form is real; only the delivery changes.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Option = { value: string; label: string };
type Status = "idle" | "sending" | "sent" | "failed";

export function InquiryForm({ className }: { className?: string }) {
  const t = useTranslations("contact.form");
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");

  const projectTypes = t.raw("projectTypes") as Option[];
  const budgets = t.raw("budgets") as Option[];
  const timelines = t.raw("timelines") as Option[];

  // The label a select shows, so the email reads as prose rather than slugs.
  const labelFor = (options: Option[], value: FormDataEntryValue | null) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? "");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!ENDPOINT) {
      const body = [
        `${t("name")}: ${data.get("name")}`,
        `${t("email")}: ${data.get("email")}`,
        `${t("projectType")} ${labelFor(projectTypes, data.get("projectType"))}`,
        `${t("budget")}: ${labelFor(budgets, data.get("budget"))}`,
        `${t("timeline")}: ${labelFor(timelines, data.get("timeline"))}`,
        "",
        String(data.get("message") ?? ""),
      ].join("\n");
      const subject = t("mailtoSubject", { name: String(data.get("name") ?? "") });
      window.location.assign(
        `mailto:${SITE.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`,
      );
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const field =
    "mt-2 w-full rounded-lg border border-border bg-surface-1 px-3.5 py-3 text-sm text-foreground " +
    "transition-colors placeholder:text-muted/70 hover:border-border-strong " +
    "focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-accent";
  const label =
    "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted";

  if (status === "sent") {
    return (
      <div
        className={cn(
          "rounded-xl border border-accent/30 bg-surface-1 p-7 sm:p-9",
          className,
        )}
        role="status"
      >
        <p className="text-[0.9375rem] leading-relaxed text-foreground">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-xl border border-border bg-background p-6 sm:p-8",
        className,
      )}
      aria-labelledby={`${uid}-title`}
    >
      <h3 id={`${uid}-title`} className="font-display text-lg font-semibold tracking-tight">
        {t("title")}
      </h3>

      {/* Formspree drops anything that fills this in; a person never sees it. */}
      <input type="text" name="_gotcha" tabIndex={-1} aria-hidden className="hidden" />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            {t("name")}
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={field}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className={label}>
            {t("email")}
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-type`} className={label}>
            {t("projectType")}
          </label>
          <select id={`${uid}-type`} name="projectType" required defaultValue="" className={field}>
            <option value="" disabled>
              {t("choose")}
            </option>
            {projectTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className={label}>
            {t("message")}
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            required
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={cn(field, "resize-y")}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-budget`} className={label}>
            {t("budget")}
          </label>
          <select id={`${uid}-budget`} name="budget" required defaultValue="" className={field}>
            <option value="" disabled>
              {t("choose")}
            </option>
            {budgets.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${uid}-timeline`} className={label}>
            {t("timeline")}
          </label>
          <select id={`${uid}-timeline`} name="timeline" required defaultValue="" className={field}>
            <option value="" disabled>
              {t("choose")}
            </option>
            {timelines.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-accent px-5 py-3",
          "text-sm font-medium text-on-accent transition-colors hover:bg-foreground",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:opacity-60 sm:w-auto",
        )}
      >
        {status === "sending" ? t("sending") : t("submit")}
        <span aria-hidden>↗</span>
      </button>

      {/* Never a dead end: a failed send still leaves a way to reach me. */}
      <p aria-live="polite" className="mt-4 text-sm leading-relaxed text-muted empty:mt-0">
        {status === "failed" ? t("error", { email: SITE.email }) : ""}
      </p>
    </form>
  );
}
