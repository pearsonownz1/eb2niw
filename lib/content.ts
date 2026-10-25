export const gcsUrl = "https://gcs.org";
export const gcsEmail = "support@gcs.org";

export const disclaimer =
  "Not a law firm; information only, not legal advice.";

export const nav = [
  { href: "/guide", label: "Guide" },
  { href: "/quiz", label: "Quiz" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const prongs = [
  {
    number: "01",
    title: "Substantial merit and national importance",
    body: "The proposed endeavor — the work you intend to pursue in the United States — must have both substantial merit and national importance. Merit can appear in business, science, technology, culture, health, or education. National importance looks at the potential impact of the work beyond one employer or a narrow local area.",
  },
  {
    number: "02",
    title: "Well positioned to advance it",
    body: "You must be well positioned to advance the proposed endeavor. Officers look at education, skills, a record of the work, a plan, and progress already made. A degree, by itself, is not the whole showing.",
  },
  {
    number: "03",
    title: "The waiver benefits the United States",
    body: "On balance, it must benefit the United States to waive the job offer and labor certification. This prong weighs the value of the proposed work against the usual requirement that an employer test the U.S. labor market.",
  },
] as const;

export const offers = [
  {
    step: "01",
    name: "Free guides",
    price: "Free",
    status: "Coming soon",
    href: "/resources",
    linkLabel: "See planned topics",
    body: "Short explainers of the pieces people usually prepare for a self-filed petition. No articles are published yet.",
  },
  {
    step: "02",
    name: "DIY guide and toolkit",
    price: "$99",
    status: "Checkout coming soon",
    href: "/guide",
    linkLabel: "View the guide page",
    body: "A written guide and templates for people preparing their own EB-2 NIW petition. The manuscript and checkout are not live.",
  },
  {
    step: "03",
    name: "Petition review",
    price: "Price not set",
    status: "Coming soon",
    href: "/services#review",
    linkLabel: "Read the service note",
    body: "A review of a draft petition package. Scope, timing, and price will be published before anyone can book it.",
  },
  {
    step: "04",
    name: "Letters, evaluations, and translations",
    price: "Through GCS",
    status: "Order on gcs.org",
    href: "/services#gcs",
    linkLabel: "How GCS fits in",
    body: "Expert opinion letters, credential evaluations, and translations are services of GEO Credential Services. This site does not take those orders.",
  },
] as const;

export const guideOutline = [
  "How the EB-2 category and the national interest waiver fit together",
  "The three prongs, in the language of Matter of Dhanasar",
  "What a self-filed petition package usually contains",
  "How to describe a proposed endeavor",
  "Evidence people commonly gather",
  "How to organize exhibits",
  "Where credential evaluations, translations, and expert opinion letters fit",
  "A checklist to use before you file",
] as const;

export const articles = [
  {
    title: "What the EB-2 NIW is",
    summary:
      "A plain-language orientation to the category and the waiver. Not written yet.",
  },
  {
    title: "Reading the three prongs",
    summary:
      "A closer walk through Matter of Dhanasar. Not written yet.",
  },
  {
    title: "The proposed endeavor, in plain language",
    summary:
      "How to tell the difference between a job title and the work itself. Not written yet.",
  },
  {
    title: "Evidence people often collect",
    summary:
      "A list of document types petitioners commonly assemble. Not written yet.",
  },
  {
    title: "Credential evaluations and translations",
    summary:
      "Where GEO Credential Services fits when a record needs an evaluation or a certified translation. Not written yet.",
  },
  {
    title: "How this site differs from a law firm",
    summary:
      "What an information site can and cannot do for a self-filed petition. Not written yet.",
  },
] as const;

export const quizTopics = [
  "Whether you can describe a proposed endeavor, not only a job title",
  "Why that endeavor could matter beyond one workplace",
  "What education, record, and plan you would point to",
  "What is still missing from a draft package",
] as const;
