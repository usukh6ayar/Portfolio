/**
 * Case-study extras — proof, trade-offs, architecture, demo, status.
 *
 * Kept here rather than in messages/*.json because almost every entry is a
 * draft or a slot waiting for real data, and JSON cannot carry the
 * `// TODO(usukh):` notes that say so. Every block renders only when its data
 * is present: an empty array, an undefined field or an empty string hides it.
 *
 * Nothing in this file may be invented. Metrics, quotes and names come from
 * the owner; trade-off drafts restate what the case-study pages already say.
 */

import type { Locale } from "@/lib/i18n/settings";
import type { ProjectId } from "@/lib/projects";

export type Localized = Record<Locale, string>;

/** One number in the Results row, e.g. { value: "12", label: "kindergartens" } */
export type ResultMetric = {
  value: string;
  label: Localized;
};

export type Testimonial = {
  quote: Localized;
  name: string;
  role: Localized;
  organization: string;
};

export type TradeOff = {
  problem: Localized;
  /** The options that were weighed */
  options: Localized;
  decision: Localized;
  /** Optional: rendered only when there is a stated reason */
  why?: Localized;
};

export type ArchNode = {
  label: string;
  /** A short role line under the label */
  note?: Localized;
  /** Things this node fans out to, drawn as one box under it (e.g. AI providers) */
  feeds?: string;
};

/**
 * Drawn top to bottom: each tier is a row of boxes, with an arrow from one
 * tier to the next. Rows stack on phones and spread across on wider screens.
 */
export type Architecture = ArchNode[][];

export type CaseStudyExtras = {
  /** Up to three; extra entries are not rendered */
  results: ResultMetric[];
  testimonial?: Testimonial;
  tradeOffs: TradeOff[];
  architecture?: Architecture;
  /** A /public path or https URL to an mp4; empty hides the slot */
  demoVideo?: string;
  /** One line on where the project stands, shown under the case-study title */
  status?: Localized;
};

export const MAX_RESULTS = 3;

export const CASE_STUDY_EXTRAS: Record<ProjectId, CaseStudyExtras> = {
  nomadkids: {
    // From the nomadkids.mn platform dashboard, 2026-11-18: 17 kindergartens,
    // 308 teachers, 1,748 children. Rounded down, since the totals include the
    // demo kindergartens (demo@nomadkids.mn). Refresh as it grows.
    results: [
      { value: "15+", label: { mn: "цэцэрлэг", en: "kindergartens" } },
      { value: "300+", label: { mn: "багш", en: "teachers" } },
      { value: "1,600+", label: { mn: "хүүхэд бүртгэлтэй", en: "children enrolled" } },
    ],
    // TODO(usukh): a real quote from a director or teacher, with permission.
    testimonial: undefined,
    // Platform dashboard, 2026-11-18: one kindergarten connected to ESIS,
    // syncing normally. Update when more connect.
    status: {
      mn: "Production-д ашиглагдаж байна · ESIS: 1 цэцэрлэг холбогдож, мэдээлэл хэвийн татагдаж байна",
      en: "In production · ESIS: 1 kindergarten connected and syncing",
    },
    // TODO(usukh): add a short screen recording (mp4) if you want one.
    demoVideo: "",
    // TODO(usukh): DRAFTS. Restated from the page; review and correct the
    // wording, especially the "why" lines, before relying on them.
    tradeOffs: [
      {
        problem: {
          mn: "Хүүхдийн хувийн мэдээлэлд хандах эрхийг захиалагчийн шаардлагаар чанд хязгаарлах ёстой байв.",
          en: "Access to children's personal data had to be tightly restricted, as the client required.",
        },
        options: {
          mn: "Эрхийг UI дээр нуух, эсвэл сервер талд хүсэлт бүр дээр шалгах.",
          en: "Hide things in the UI, or check access on the server for every request.",
        },
        decision: {
          mn: "Эрхийг сервер талд хэрэглэгчийн үүрэг ба хүүхэд тус бүрээр шалгана. Эрх гишүүнчлэл дээр тогтдог тул нэг хүн багш болон эцэг эхийн эрхийг зэрэг ашиглаж болно.",
          en: "Access is checked on the server, per role and per child. Permissions hang off membership, so one person can be both a teacher and a parent.",
        },
        why: {
          mn: "UI дээр нуух нь хамгаалалт биш. RBAC, tenancy болон IDOR-оос хамгаалах матрицыг өгөгдлийн сангийн бүтцэд суулгасан.",
          en: "Hiding something in the UI is not protection. An RBAC, tenancy and IDOR matrix is built into the schema.",
        },
      },
      {
        problem: {
          mn: "Нэвтрэлтийн token-ыг хаана хадгалах вэ.",
          en: "Where to keep the sign-in tokens.",
        },
        options: {
          mn: "Браузерын localStorage, эсвэл HttpOnly cookie.",
          en: "Browser localStorage, or HttpOnly cookies.",
        },
        decision: {
          mn: "Same-site HttpOnly cookie: богино хугацааны access token, эргэлддэг refresh. localStorage-д ямар ч token хадгалахгүй.",
          en: "Same-site HttpOnly cookies: a short-lived access token and a rotating refresh. No token is ever kept in localStorage.",
        },
        // TODO(usukh): add the reason in your own words if you want a "why".
      },
      {
        problem: {
          mn: "Тайланг хэвлэхэд бэлэн, кирилл үсэг зөв харагдах A4 PDF болгох шаардлагатай.",
          en: "Reports had to come out as print-ready A4 PDFs with correct Cyrillic.",
        },
        options: {
          mn: "PDF-ийг API хүсэлт дотор үүсгэх, эсвэл дараалалд оруулж тусдаа worker-ээр үүсгэх.",
          en: "Generate the PDF inside the API request, or queue it for a separate worker.",
        },
        decision: {
          mn: "BullMQ дараалал болон Puppeteer worker ашиглан A4, кирилл дэмжлэгтэй PDF үүсгэнэ.",
          en: "A BullMQ queue and a Puppeteer worker render A4 PDFs with Cyrillic support.",
        },
        // TODO(usukh): add why the work moved off the request, if you want it shown.
      },
      {
        problem: {
          mn: "ESIS-ийн v2 каталогид 198 сервис байгаа ч бүгд хэрэггүй.",
          en: "The ESIS v2 catalogue has 198 services, and most are not needed.",
        },
        options: {
          mn: "Каталогийг бүхэлд нь холбох, эсвэл зөвхөн шаардлагатайг нь.",
          en: "Connect the whole catalogue, or only what the product needs.",
        },
        decision: {
          mn: "Хамгийн бага эрхийн зарчмаар шаардлагатай 39 үйлчилгээг холбосон.",
          en: "Connected the 39 services it needs, on least privilege.",
        },
        why: {
          mn: "Хамгийн бага эрхийн зарчим: системд хэрэггүй эрх олгохгүй.",
          en: "Least privilege: grant the system nothing it does not use.",
        },
      },
      {
        problem: {
          mn: "Олон цэцэрлэгийн мэдээллийг нэг провайдер токеноор авах ч хооронд нь холих ёсгүй.",
          en: "Many kindergartens' data arrives through one provider token, and must never mix.",
        },
        options: {
          mn: "Цэцэрлэг бүрт тусдаа орчин, эсвэл нэг мульти-тенант систем.",
          en: "A separate deployment per kindergarten, or one multi-tenant system.",
        },
        decision: {
          mn: "Нэг мульти-тенант архитектур: байгууллага бүрийн мэдээллийг тусад нь тусгаарлан боловсруулна.",
          en: "One multi-tenant architecture that keeps each organisation's data isolated.",
        },
        // TODO(usukh): the page does not say why one system over many; add it if you want.
      },
    ],
    architecture: [
      [{ label: "Next.js web", note: { mn: "Захирал, багш, тогооч, нягтлан, эцэг эх", en: "Director, teacher, cook, accountant, parent" } }],
      [{ label: "NestJS API", note: { mn: "Сервер талын эрхийн шалгалт · Prisma", en: "Server-side authorization · Prisma" } }],
      [
        { label: "PostgreSQL", note: { mn: "28 хүснэгт", en: "28 tables" } },
        { label: "Cloudflare R2", note: { mn: "Хаалттай медиа · presigned", en: "Private media · presigned" } },
        { label: "BullMQ worker", note: { mn: "Puppeteer → A4 PDF", en: "Puppeteer → A4 PDF" } },
        { label: "ESIS", note: { mn: "39 сервис", en: "39 services" } },
      ],
    ],
  },

  sparkxp: {
    // From the SparkXP admin word bank, 2026-11-18: 21,377 words, 12,351 with
    // an image, 19,356 with audio. Content, not users: the app is pre-launch.
    // TODO(usukh): swap in students / schools once there are real numbers.
    results: [
      { value: "21,000+", label: { mn: "үгийн сан дахь үг", en: "words in the word bank" } },
      { value: "12,000+", label: { mn: "зурагтай үг", en: "words with an image" } },
      { value: "19,000+", label: { mn: "аудиотой үг", en: "words with audio" } },
    ],
    // TODO(usukh): a real quote from a teacher or school, with permission.
    testimonial: undefined,
    // TODO(usukh): add a short screen recording (mp4) if you want one.
    demoVideo: "",
    // TODO(usukh): DRAFTS. Restated from the page; review and correct them.
    tradeOffs: [
      {
        problem: {
          mn: "Апп олон AI үйлчилгээ ашигладаг: үгсийн сан, унших дасгал, толь, зураг, аудио, яриа.",
          en: "The app leans on several AI services: vocabulary, reading, dictionary, images, audio and conversation.",
        },
        options: {
          mn: "Хэсэг бүрээс provider-уудыг шууд дуудах, эсвэл бүх дуудлагыг нэг gateway-ээр дамжуулах.",
          en: "Call each provider directly from wherever it is needed, or route every call through one gateway.",
        },
        decision: {
          mn: "Нэгдсэн AI Gateway: Gemini (үгсийн сан, унших дасгал, толь), OpenAI Batch API (зураг), ElevenLabs (аудио), Azure (Text-to-Speech).",
          en: "One AI Gateway: Gemini for vocabulary, reading and the dictionary, OpenAI's Batch API for images, ElevenLabs for audio, Azure for text-to-speech.",
        },
        why: {
          mn: "Контент үүсгэлт, яриа боловсруулалт болон хэрэглээний хязгаарлалтыг нэг дор удирдана.",
          en: "Content generation, conversation handling and usage limits live in one place.",
        },
      },
      {
        problem: {
          mn: "AI ассистантын аудио дуудлага бүр зардалтай.",
          en: "Every audio call the AI buddy makes costs money.",
        },
        options: {
          mn: "Хүсэлт бүрт аудиог шинээр үүсгэх, эсвэл үүсгэснийг кэшлэх.",
          en: "Generate audio fresh on every request, or cache what has been generated.",
        },
        decision: {
          mn: "Үүсгэсэн аудиог кэшэлдэг; яриаг сургуулийн багцын хязгаарт тааруулан боловсруулна.",
          en: "Generated audio is cached, and conversation is shaped to the school plan's limits.",
        },
        why: {
          mn: "Давтан дуудлагын зардал 0 болсон.",
          en: "Repeat calls cost nothing.",
        },
      },
      {
        problem: {
          mn: "API болон админ самбарыг хаана байршуулах вэ.",
          en: "Where to host the API and the admin dashboard.",
        },
        options: {
          mn: "Хоёуланг нэг платформд, эсвэл тус тусад нь тохирох платформд.",
          en: "Both on one platform, or each on the platform that suits it.",
        },
        decision: {
          mn: "API нь Railway дээр, админ самбар Vercel дээр.",
          en: "The API runs on Railway, the admin dashboard on Vercel.",
        },
        // TODO(usukh): the page does not say why; add the reason if you want it shown.
      },
    ],
    architecture: [
      [
        { label: "Mobile app (Expo)", note: { mn: "Сурагч, багш", en: "Students, teachers" } },
        { label: "Landing", note: { mn: "Танилцуулга сайт", en: "Public site" } },
        { label: "Admin", note: { mn: "Контент баг", en: "Content team" } },
      ],
      [{ label: "NestJS API" }],
      [
        { label: "PostgreSQL" },
        { label: "Redis" },
        {
          label: "AI Gateway",
          note: { mn: "Хэрэглээний хязгаар · кэш", en: "Usage limits · cache" },
          feeds: "Gemini · OpenAI · ElevenLabs · Azure",
        },
      ],
    ],
  },

  udshijan: {
    // TODO(usukh): real results only (orders, products, repeat customers).
    results: [],
    testimonial: undefined,
    tradeOffs: [],
    demoVideo: "",
  },
};
