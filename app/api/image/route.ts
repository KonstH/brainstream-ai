import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs"

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored securely
});

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = "1", resolution = "512x512" } = body

    if (!userId) return new Response("Unauthorized", { status: 401 })
    if (!openai.apiKey) return new Response("Unauthorized", { status: 401 })
    if (!prompt) return new Response("Prompt is required", { status: 400 })
    if (!amount) return new Response("Amount is required", { status: 400 })
    if (!resolution) return new Response("Resolution is required", { status: 400 })

    const freeTrial = await checkApiLimit();
    const isProUser = await checkSubscription();

    /**
     * Note: Status 403 is crucial here, as it will allow us to detect the limit on the
     * font-end accordingly and trigger the PRO subscription
     */
    if (!freeTrial && !isProUser) return new Response("Free trial has expired.", { status: 403 })

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution
    })

    if (!isProUser) await increaseApiLimit();
    return Response.json(response.data);
  } catch (error) {
    console.error("Image Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}
