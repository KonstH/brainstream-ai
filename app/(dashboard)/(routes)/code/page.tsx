"use client";

import * as z from "zod";
import axios from "axios"
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import Heading from "@/components/Heading";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import ReactMarkDown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

export default function CodePage() {
  const proModal = useProModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const router = useRouter()
  const isLoading = form.formState.isSubmitting;
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt
      }

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/code', {
        messages: newMessages
      })

      setMessages(c => [...c, userMessage, response.data])

      form.reset()
    } catch(error: any) {
      // User has reached their free tier limit, upsell PRO
      if (error?.response?.status === 403) {
        proModal.onOpen()
      }
    } finally {
      router.refresh() // rehydrates all server components, fetching the newest data from db
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code through prompts"
        icon={Code}
        iconColor="text-green-700"
        bgColor="text-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
              <FormField name="prompt" render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Give me a code snippet for a website sticky header."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}/>
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && <Loader />}
          {!messages.length && !isLoading && (
            <Empty label="No chats started." />
          )}
          <div className="flex flex-col gap-y-4">
            {messages.map(message => (
              <div
                key={message.content as string}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg first:mb-8",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-slate-700/10"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkDown
                  components={{
                    pre: ({ node, ...props}) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props}) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    )
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content as string || ""}
                </ReactMarkDown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
