"use client";

import * as z from "zod";
import axios from "axios"
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import Heading from "@/components/Heading";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";

export default function MusicPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const router = useRouter()
  const isLoading = form.formState.isSubmitting;
  const [isMounted, setIsMounted] = useState(false)
  const [music, setMusic] = useState<string>("")

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic("");

      const response = await axios.post('/api/music', values)
      setMusic(response.data.audio);
      form.reset()
    } catch(error) {
      // TODO: Open pro upsell modal
      console.error(error)
    } finally {
      router.refresh()
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Generate music through prompts"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="text-emerald-500/10"
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
                      placeholder="Saxophone solo."
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
          {isLoading && <Loader label="Generating..." />}
          {!music && !isLoading && (
            <Empty label="No music generated." />
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  )
}
