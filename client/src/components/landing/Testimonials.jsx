import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Class of 2015",
      image: "https://i.pravatar.cc/100?img=1",
      content: "The alumni network helped me reconnect with old friends and find career opportunities through fellow graduates. It's been an incredible resource since graduation.",
    },
    {
      name: "Michael Chen",
      role: "Class of 2010",
      image: "https://i.pravatar.cc/100?img=2",
      content: "Mentoring current students has been incredibly rewarding. The platform makes it easy to schedule sessions and track my impact on the next generation.",
    },
    {
      name: "Jessica Williams",
      role: "Class of 2018",
      image: "https://i.pravatar.cc/100?img=3",
      content: "I found my current job through a connection I made at an alumni networking event. This platform has been invaluable for my professional growth.",
    },
  ];

  return (
    <div id="testimonials" className="bg-slate-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">Alumni Success Stories</h2>
          <p className="mx-auto max-w-3xl text-white">
            Hear from members of our alumni community about how the platform has helped them stay connected and grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col p-6 shadow-lg bg-slate-800 border-slate-700 hover:-translate-y-1 transition-all hover:shadow-blue-900/20">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
              </div>
              <p className="mb-6 text-slate-300">{testimonial.content}</p>
              <div className="mt-auto flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-slate-700">
                  <img src={testimonial.image} alt={testimonial.name} />
                </Avatar>
                <div>
                  <h4 className="font-medium text-white">{testimonial.name}</h4>
                  <p className="text-sm text-blue-300">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}