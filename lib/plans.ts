export const planIds = ["diy", "attorney_review"] as const;

export type PlanId = (typeof planIds)[number];

export type PlanDefinition = {
  id: PlanId;
  name: string;
  priceLabel: string;
  stripePriceId: string;
  badge: string | null;
  summary: string;
  features: readonly string[];
};

export const plans: Record<PlanId, PlanDefinition> = {
  diy: {
    id: "diy",
    name: "DIY",
    priceLabel: "$XXX",
    stripePriceId: "price_diy_placeholder",
    badge: null,
    summary: "Prepare the petition yourself with templates, tutorials, and checklists.",
    features: [
      "Access to petition templates",
      "Step-by-step video tutorials",
      "Form-filling assistance for the I-140 and supporting forms",
      "A personalized evidence checklist",
      "Access to a community of other NIW filers",
    ],
  },
  attorney_review: {
    id: "attorney_review",
    name: "DIY + Attorney Review",
    priceLabel: "$X,XXX",
    stripePriceId: "price_attorney_review_placeholder",
    badge: "Premium",
    summary: "Everything in DIY, plus an independent attorney on the package.",
    features: [
      "Everything in DIY",
      "An attorney consultation and case strategy call",
      "Full attorney review of the petition package",
      "Petition letter edits and feedback",
      "RFE response support",
      "Priority support",
      "A filing-ready package check before submission",
    ],
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return value === "diy" || value === "attorney_review";
}

export function readPlanId(value: unknown): PlanId | null {
  return isPlanId(value) ? value : null;
}

/**
 * Premium tools follow the plan the person chose. Payment is not collected
 * yet, so a pending_payment Premium row still unlocks that workspace. When
 * Stripe is live, require status === "active" before unlocking.
 */
export function premiumUnlocked(plan: PlanId | null): boolean {
  return plan === "attorney_review";
}
