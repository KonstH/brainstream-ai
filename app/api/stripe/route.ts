import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings")

export async function GET() {
  try {
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) return new Response("Unauthorized", { status: 401 })

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: { userId }
    })

    /**
     * Recurring user, we redirect them to the billing page, to cancel or
     * upgrade their active subscription
     */
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl
      })

      return Response.json({ url: stripeSession.url });
    }

    // It's the user's first time subscribing to our application, send them to checkout
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Brainstream PRO",
              description: "Unlimited AI Generations"
            },
            unit_amount: 2000,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        /**
         * very important; this is what allows us to link the purchase to a specific customer
         * in our stripe webhooks, since we won't have access to Clerk there
         */
        userId
      }
    })

    return Response.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Stripe Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}