import { auth } from "@clerk/nextjs"

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored securely
});

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) return new Response("Unauthorized", { status: 401 })
    if (!openai.apiKey) return new Response("Unauthorized", { status: 401 })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    response.choices.forEach(m => console.log('message routes.ts', m))

    return Response.json(response.choices[0].message);
  } catch (error) {
    console.error("Chat Error:", error)
    return new Response("Internal Error", { status: 500 })
  }
}
