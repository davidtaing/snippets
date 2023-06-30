import { NextApiRequest, NextApiResponse } from "next";

import pino from "pino";
import Stripe from "stripe";
import { buffer } from "micro";

import { getRequiredEnvVariable } from "@/utils/utils";

const stripe = new Stripe(getRequiredEnvVariable("STRIPE_SECRET_KEY"), {
  apiVersion: "2022-11-15",
});

const logger = pino({ name: "Payments Webhook Handler" });
const Errors = {
  MISSING_STRIPE_WEBHOOK_SECRET: "STRIPE_WEBHOOK_SECRET is not set",
  MISSING_STRIPE_SIGNATURE_HEADER:
    "Stripe signature is missing from request headers.",
} as const;

export type VerifyWebhookResult<T> =
  | {
      type: "verified";
      payload: T;
    }
  | {
      type: "error";
      status: number;
      error: Error;
    };

export type StripeWebhookVerificationResult = VerifyWebhookResult<Stripe.Event>;

export async function verifyStripeWebhook(
  req: NextApiRequest
): Promise<StripeWebhookVerificationResult> {
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_WEBHOOK_SECRET) {
    return {
      type: "error",
      status: 500,
      error: new Error(Errors.MISSING_STRIPE_WEBHOOK_SECRET),
    };
  }

  const payload = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    if (!sig) throw new Error(Errors.MISSING_STRIPE_SIGNATURE_HEADER);

    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    logger.info({ error }, "Webhook Verification Error");
    return { type: "error", status: 400, error };
  }

  return { type: "verified", payload: event };
}

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const verificationResult = await verifyStripeWebhook(req);

  if (verificationResult.type === "error") {
    return res
      .status(verificationResult.status)
      .json({ error: verificationResult.error });
  }

  const event = verificationResult.payload.type;

  switch (event) {
    case "payment_intent.succeeded":
      return res.status(200).json({ event });
    default:
      return res.status(200).json({ event });
  }
}
