import { Card } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      title: "Connect with Classmates",
      description: "Find and reconnect with former classmates, build your network, and stay in touch with friends from your school days.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: "Mentor Junior Students",
      description: "Share your experience and knowledge with current students, help guide their careers, and make a meaningful impact.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
    },
    {
      title: "Attend School Events",
      description: "Stay informed about reunions, homecomings, fundraisers, and special events happening at your alma mater.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-primary">Stay Connected. Give Back. Grow Together.</h2>
          <p className="mx-auto max-w-3xl text-white">
            Our alumni network provides the tools and opportunities to maintain meaningful connections with your school community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (            <Card key={index} className="flex flex-col items-start p-6 transition-all hover:shadow-primary/20 bg-secondary border-secondary-foreground/20 text-secondary-foreground hover:-translate-y-1">
              <div className="mb-4 rounded-full bg-secondary-foreground/10 p-3">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-medium text-secondary-foreground">{feature.title}</h3>
              <p className="text-secondary-foreground/80">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}