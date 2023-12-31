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
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt
        }
      }
    );

    if (!isProUser) await increaseApiLimit();
    return Response.json(response);
  } catch (error) {
    console.error("Music Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}
