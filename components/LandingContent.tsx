"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Alice",
    avatar: "A",
    title: "Writer",
    description: "With this tool I get through five times as many papers!"
  },
  {
    name: "Jerry",
    avatar: "J",
    title: "Software Engineer",
    description: "This tool boosted my productivity like crazy!"
  },
  {
    name: "Marlin",
    avatar: "M",
    title: "Music Producer",
    description: "I use it every day!"
  },
  {
    name: "Sandra",
    avatar: "S",
    title: "Software Engineer",
    description: "Whenever I need a sidekick to my projects, this is where I come."
  }
]

export default function LandingContent() {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map(item => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
