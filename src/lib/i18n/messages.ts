import en from "../../../messages/en.json";
import mn from "../../../messages/mn.json";
import type { Locale } from "@/lib/i18n/settings";

export const messagesByLocale = {
  en,
  mn,
} as const;

export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? messagesByLocale.en;
}
