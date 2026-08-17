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
 * it works, who it's for) was provided by the client in Arabic only —
 * displayed verbatim, in Arabic, regardless of the active site locale,
 * rather than inventing an English rendering of wording we were not given.
 */
export type PackageTier = {
  slug: string
  index: number
  price: string
  cadence: string
  badge: "core" | "premium" | null
}

export const PACKAGES: PackageTier[] = [
  { slug: "creative-support", index: 1, price: "$400", cadence: "/month", badge: null },
  { slug: "brand-visual-execution", index: 2, price: "$1,000", cadence: "/month", badge: "core" },
  { slug: "visual-production-partner", index: 3, price: "$2,500", cadence: "/month", badge: "premium" },
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

export const PACKAGE_DETAILS: Record<string, PackageDetail> = {
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
}
