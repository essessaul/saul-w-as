import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK || "";

export async function getStripe() {
  if (!publishableKey) throw new Error("Stripe publishable key is not configured.");
  return loadStripe(publishableKey);
}

export async function openStripePaymentLink() {
  if (!paymentLink) throw new Error("Stripe payment link is not configured.");
  window.open(paymentLink, "_blank", "noopener,noreferrer");
}
