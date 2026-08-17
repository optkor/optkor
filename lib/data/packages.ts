/**
 * PLACEHOLDER DATA — there is no `packages` table in Supabase yet.
 *
 * This is the package content the client has provided directly (tier
 * order, monthly price, and full scope detail). Shaped so wiring this to
 * real dynamic data later is a one-line swap in the pages that import it,
 * not a rewrite of the components.
 *
 * Tier name/positioning copy for the package CARDS lives in the i18n
 * dictionary (`dict.packages`) so those stay bilingual like the rest of the
 * site. The deeper DETAIL content below (what's included, what isn't, how
 * it works, who it's for) was originally provided by the client in Arabic
 * only; the English column is a professional translation of that same
 * content (same scope, same claims — nothing invented), not a fallback or
 * placeholder, so the package detail pages are fully bilingual like every
 * other page instead of always showing Arabic regardless of site locale.
 */
export type PackageTier = {
  slug: string
  index: number
  price: string
  cadence: string
  badge: "core" | "premium" | null
}

export const PACKAGES: PackageTier[] = [
  { slug: "creative-support", index: 1, price: "$500", cadence: "/month", badge: null },
  { slug: "brand-visual-execution", index: 2, price: "$1,500", cadence: "/month", badge: "core" },
  { slug: "visual-production-partner", index: 3, price: "$3,200", cadence: "/month", badge: "premium" },
]

export type PackageDetail = {
  /** What the client is buying, in one line. */
  whatYouBuy: string
  /** Secondary notes about how the capacity/commitment works, if any. */
  notes?: string[]
  includes: string[]
  notIncludes: string[]
  workflow: string[]
  bestFor: string[]
}

export const PACKAGE_DETAILS: Record<"en" | "ar", Record<string, PackageDetail>> = {
  en: {
    "creative-support": {
      whatYouBuy: "A ready creative designer or team that executes whatever you need, on demand.",
      notes: ["Not a fixed list of services.", "We work within a defined monthly capacity."],
      includes: [
        "Social media designs",
        "Ad designs (posters, billboards, banners)",
        "Print designs",
        "Revisions to existing designs",
        "Adherence to the client's or campaign's visual style",
      ],
      notIncludes: [
        "Building a brand identity from scratch",
        "Photography",
        "Long-form motion graphics",
        "Campaign management",
      ],
      workflow: [
        "A creative director reviews every deliverable",
        "Designer(s) assigned based on workload",
        "A defined number of revisions per request",
      ],
      bestFor: [
        "Early-stage marketing agencies",
        "Companies that just need execution",
        "The start of a working relationship",
      ],
    },
    "brand-visual-execution": {
      whatYouBuy: "A full visual production arm that turns your marketing ideas into professional visual reality.",
      includes: [
        "Social media designs",
        "Advertising campaign designs",
        "Billboard and out-of-home ad designs",
        "Print designs",
        "Motion graphics (short / medium length)",
        "Video editing",
        "Genuine creative supervision",
        "A unified visual style across all output",
      ],
      notIncludes: [
        "Marketing strategy",
        "Media buying",
        "High-end cinematic filming",
        "Changing brand strategy after it's been approved",
      ],
      workflow: [
        "A creative director owns quality end to end",
        "Clear task distribution",
        "Managed revision rounds",
        "Higher execution priority",
      ],
      bestFor: ["Growing marketing agencies", "Agencies with an active client roster", "Ongoing, continuous work"],
    },
    "visual-production-partner": {
      whatYouBuy: "Peace of mind, full supervision, and end-to-end execution.",
      notes: ["Without building an in-house team."],
      includes: [
        "Every type of design",
        "Building a visual identity from scratch",
        "Identity development and application",
        "Professional photography (high quality)",
        "Advanced video editing",
        "Short- and long-form motion graphics",
        "A dedicated project manager",
        "Full creative supervision",
        "Top priority",
      ],
      notIncludes: ["Marketing", "Strategy", "Media buying"],
      workflow: ["A project manager", "A creative director", "A complete production team", "Monthly planning"],
      bestFor: ["Established marketing agencies", "Large-scale clients", "Long-term partnerships"],
    },
  },
  ar: {
    "creative-support": {
      whatYouBuy: "مصمم/فريق إبداعي جاهز ينفّذ أي فكرة مطلوبة حسب الحاجة",
      notes: ["لا نعدّ خدمات", "نشتغل حسب سعة شهرية محددة"],
      includes: [
        "تصاميم سوشيال ميديا",
        "تصاميم إعلانات (بوسترات – بوردات – بنرات)",
        "تصاميم برنت",
        "تعديلات على تصاميم قائمة",
        "التزام بأسلوب العميل أو حملته",
      ],
      notIncludes: ["بناء هوية من الصفر", "تصوير", "موشن جرافيك طويل", "إدارة حملات"],
      workflow: ["مدير إبداعي يراجع", "مصمم/مصممين حسب الحمل", "عدد تعديلات محدد"],
      bestFor: ["شركات تسويق ناشئة", "شركات بدها تنفيذ فقط", "بداية علاقة"],
    },
    "brand-visual-execution": {
      whatYouBuy: "ذراع إنتاج بصري كامل يحوّل أفكاره التسويقية إلى واقع مرئي احترافي",
      includes: [
        "تصاميم سوشيال ميديا",
        "تصاميم حملات إعلانية",
        "تصاميم بوردات وإعلانات خارجية",
        "تصاميم برنت",
        "موشن جرافيك (قصير / متوسط)",
        "فيديو إيديت",
        "إشراف إبداعي حقيقي",
        "توحيد الأسلوب البصري",
      ],
      notIncludes: ["استراتيجية تسويق", "Media Buying", "تصوير سينمائي عالي جدًا", "تغيير استراتيجية البراند بعد اعتمادها"],
      workflow: ["مدير إبداعي مسؤول عن الجودة", "توزيع مهام واضح", "إدارة تعديلات", "أولوية تنفيذ أعلى"],
      bestFor: ["شركات تسويق نامية", "وكالات عندها عملاء فعليين", "شغل مستمر"],
    },
    "visual-production-partner": {
      whatYouBuy: "راحة بال + إشراف + تنفيذ شامل",
      notes: ["بدون ما يبني فريق داخلي"],
      includes: [
        "كل أنواع التصميم",
        "بناء هوية بصرية من الصفر",
        "تطوير وتطبيق الهوية",
        "تصوير احترافي (جيد جدًا)",
        "فيديو إيديت متقدم",
        "موشن جرافيك قصير وطويل",
        "مدير مشروع",
        "إشراف إبداعي كامل",
        "أولوية قصوى",
      ],
      notIncludes: ["تسويق", "استراتيجية", "Media Buying"],
      workflow: ["مدير مشروع", "مدير إبداعي", "فريق إنتاج متكامل", "تخطيط شهري"],
      bestFor: ["شركات تسويق قوية", "عملاء كبار", "شراكات طويلة"],
    },
  },
}
