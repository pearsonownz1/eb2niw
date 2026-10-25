export const brand = "EB2NIW";

/** Non-breaking hyphen so "EB-2" cannot split after EB-. */
export const eb2 = "EB\u20112";
/** "EB-2 NIW" kept on one line. */
export const eb2niw = "EB\u20112\u00A0NIW";

export const disclaimer =
  "EB2NIW is not a law firm, and attorney review is provided by independent attorneys.";

export const nav = [
  { href: "/pricing", label: "Pricing" },
  { href: "/pricing#how-it-works", label: "How it works" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
] as const;

export const features = [
  {
    title: "Guided online questionnaire",
    body: "Questions in plain language, one step at a time, covering your proposed endeavor, your record, and the three Dhanasar prongs.",
    attorneyOnly: false,
  },
  {
    title: "Personalized evidence checklist",
    body: "A checklist built from your answers, so you collect the exhibits that match the endeavor you described.",
    attorneyOnly: false,
  },
  {
    title: "Petition letter builder",
    body: "A structured draft of the petition letter, organized around substantial merit and national importance, how you are positioned, and the balance prong.",
    attorneyOnly: false,
  },
  {
    title: "Recommendation letter kit",
    body: "Prompts and a sample structure for letters from people who know the work, for you to send and edit yourself.",
    attorneyOnly: false,
  },
  {
    title: "Filing-ready package",
    body: "The letter, forms checklist, and exhibit list assembled in one package you can file yourself.",
    attorneyOnly: false,
  },
  {
    title: "Independent attorney review",
    body: "A licensed immigration attorney who is not employed by EB2NIW reads the full package before you file.",
    attorneyOnly: true,
  },
  {
    title: "Attorney Q&A",
    body: "Questions you can ask that independent attorney about the draft package. The attorney answers. EB2NIW does not.",
    attorneyOnly: true,
  },
] as const;

export const whyCards = [
  {
    title: "No lawyer required to file",
    body: "You may prepare and file an EB‑2 NIW petition yourself. The software is the guide. An attorney is an option on the second plan, not a requirement to use the product.",
  },
  {
    title: "Self-petition, no employer sponsor",
    body: "The national interest waiver is a self-petition. You do not need a job offer, and you do not need an employer to run labor certification.",
  },
  {
    title: "Work at your own pace",
    body: "The flow is a sequence of steps you can leave and return to. Nothing is sent to USCIS until you decide to file.",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Answer questions",
    body: "Describe the work you propose to do in the United States, your education, and the evidence you already have.",
  },
  {
    number: "02",
    title: "Build the petition",
    body: "Draft the petition letter step by step around the three Dhanasar prongs.",
  },
  {
    number: "03",
    title: "Assemble the evidence",
    body: "Work through the checklist and put exhibits in the order the letter cites them.",
  },
  {
    number: "04",
    title: "Get a filing-ready package",
    body: "Leave with the package you would file. On the Attorney Review plan, an independent attorney reads it first.",
  },
] as const;

export const comparison = [
  { feature: "Guided online questionnaire", diy: "Included", review: "Included" },
  { feature: "Personalized evidence checklist", diy: "Included", review: "Included" },
  { feature: "Petition letter builder", diy: "Included", review: "Included" },
  { feature: "Recommendation letter kit", diy: "Included", review: "Included" },
  { feature: "Filing-ready package", diy: "Included", review: "Included" },
  {
    feature: "Independent attorney review of the full package",
    diy: "Not included",
    review: "Included",
  },
  { feature: "Attorney Q&A", diy: "Not included", review: "Included" },
  { feature: "Price", diy: "$XXX", review: "$X,XXX" },
] as const;

export const faqs = [
  {
    question: "Do I need a job offer?",
    answer:
      "No. An EB‑2 National Interest Waiver is a self-petition. You do not need a job offer or a labor certification. You still have to address the three Dhanasar prongs for the endeavor you propose.",
  },
  {
    question: "What is the Dhanasar test?",
    answer:
      "USCIS decides these cases under Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016). In short: the proposed endeavor has substantial merit and national importance; you are well positioned to advance it; and, on balance, it benefits the United States to waive the job offer and labor certification. That is a paraphrase, not a substitute for the decision.",
  },
  {
    question: "What does attorney review include?",
    answer:
      "On the DIY + Attorney Review plan, an independent licensed immigration attorney reviews the package you built in the software before you file, and you can ask that attorney questions about the draft. EB2NIW is not a law firm. The review is the attorney's, not ours.",
  },
  {
    question: "What if I get an RFE?",
    answer:
      "A request for evidence is USCIS asking for more proof. The product is designed so you can add documents and revise the letter. It does not promise that a request will be avoided, or that a response will be approved. On the Attorney Review plan, an independent attorney can review a draft response. That review is not a guarantee.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. EB2NIW is not a law firm, and attorney review is provided by independent attorneys. The questionnaire, checklist, and letter builder are tools for preparing your own petition. They do not tell you whether you qualify or whether you should file.",
  },
  {
    question: "Can I start a petition today?",
    answer:
      "Check your eligibility, then choose DIY or DIY + Attorney Review and create an account. Payment is not open yet. The prices on the plans page are placeholders.",
  },
] as const;

export const articles = [
  {
    title: "What the EB‑2 NIW is",
    summary:
      "A free orientation to the category and the waiver. Not written yet.",
  },
  {
    title: "The three prongs, in plain language",
    summary:
      "A free reading of Matter of Dhanasar. The short version is in the FAQ. The long version is not written yet.",
  },
  {
    title: "How a self-filed package is usually organized",
    summary:
      "A free look at the letter, exhibits, and forms people assemble themselves. Not written yet.",
  },
  {
    title: "Recommendation letters, without a script to copy",
    summary:
      "What a letter is for, and what the software kit will help you request. Not written yet.",
  },
] as const;

export const photoCredits = [
  {
    name: "Musinga Pictures",
    href: "https://www.pexels.com/photo/joyful-family-portrait-with-children-and-mother-37565203/",
    source: "Pexels",
  },
  {
    name: "Donviour Photography",
    href: "https://www.pexels.com/photo/mother-with-her-son-and-daughter-standing-on-a-street-15556210/",
    source: "Pexels",
  },
  {
    name: "Mizuno K",
    href: "https://www.pexels.com/photo/family-with-kid-eating-breakfast-together-12788329/",
    source: "Pexels",
  },
  {
    name: "Christina @ wocintechchat.com",
    href: "https://unsplash.com/photos/shallow-focus-photo-of-woman-in-gray-jacket-0Zx1bDv5BNY",
    source: "Unsplash",
  },
] as const;
