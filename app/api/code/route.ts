import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs"

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored securely
});

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) return new Response("Unauthorized", { status: 401 })
    if (!openai.apiKey) return new Response("Unauthorized", { status: 401 })
    if (!messages) return new Response("Messages are required", { status: 400 })

    const freeTrial = await checkApiLimit();

    /**
     * Note: Status 403 is crucial here, as it will allow us to detect the limit on the
     * font-end accordingly and trigger the PRO subscription
     */
    if (!freeTrial) return new Response("Free trial has expired.", { status: 403 })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages]
    });

    await increaseApiLimit();
    return Response.json(response.choices[0].message);
  } catch (error) {
    console.error("Code Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}
