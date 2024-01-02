"use client";

import * as z from "zod";
import axios from "axios"
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
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
import { useProModal } from "@/hooks/useProModal";

export default function ChatPage() {
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

      const response = await axios.post('/api/chat', {
        messages: newMessages
      })

      setMessages(c => [...c, userMessage, response.data])

      form.reset()
    } catch(error: any) {
      if (error?.response?.status === 403) { // User has reached their free tier limit, upsell PRO
        proModal.onOpen()
      } else {
        toast.error("Something went wrong")
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
        title="Chat"
        description="Advanced chat model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="text-violet-500/10"
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
                      placeholder="Recommend a dish to bring to a potluck."
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
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map(message => (
              <div
                key={message.content as string}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg last:mb-8",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-slate-700/10"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm my-auto">
                  {message.content as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
