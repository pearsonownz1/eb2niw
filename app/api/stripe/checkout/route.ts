import { plans, readPlanId } from "@/lib/plans";

/**
 * Stripe checkout stub. This route never creates a charge, even if a secret
 * key is present. The in-app button records pending_payment instead.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const planId = readPlanId(body && typeof body === "object" ? (body as { planId?: unknown }).planId : null);
  if (!planId) {
    return Response.json({ ok: false, message: "Unknown plan." }, { status: 400 });
  }

  const plan = plans[planId];
  return Response.json(
    {
      ok: false,
      message: "Stripe is not configured. No payment was created.",
      planId: plan.id,
      stripePriceId: plan.stripePriceId,
    },
    { status: 501 },
  );
}
