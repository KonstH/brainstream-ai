import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs"
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt } = body

    if (!userId) return new Response("Unauthorized", { status: 401 })
    if (!prompt) return new Response("Prompt is required", { status: 400 })

    const freeTrial = await checkApiLimit();
    const isProUser = await checkSubscription();

    /**
     * Note: Status 403 is crucial here, as it will allow us to detect the limit on the
     * font-end accordingly and trigger the PRO subscription
     */
    if (!freeTrial && !isProUser) return new Response("Free trial has expired.", { status: 403 })

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt
        }
      }
    );

    if (!isProUser) await increaseApiLimit();
    return Response.json(response);
  } catch (error) {
    console.error("Video Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}
