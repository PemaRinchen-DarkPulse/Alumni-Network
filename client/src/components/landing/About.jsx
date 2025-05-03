import { Card } from "@/components/ui/card";

export function About() {
  const benefits = [
    {
      title: "Networking",
      description: "Expand your professional connections with fellow alumni in various industries and locations around the world.",
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
      title: "Career Growth",
      description: "Access exclusive job opportunities, career advice, and professional development resources shared by alumni.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      ),
    },
    {
      title: "Giving Back",
      description: "Mentor current students, volunteer at school events, and contribute to scholarship funds for the next generation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">About The Network</h2>
          <p className="mx-auto max-w-3xl text-white md:text-lg">
            The Central High Alumni Network is a dedicated community platform for all graduates of Central High School.
          </p>
        </div>

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h3 className="mb-4 text-2xl font-semibold text-white">Our Purpose</h3>
          <p className="mb-6 text-lg text-slate-300">
            The Alumni Portal serves as a bridge connecting past, present, and future members of the Central High community. 
            We aim to create a supportive ecosystem where alumni can reconnect with their roots, contribute to their alma mater's growth,
            and help shape the future of current students.
          </p>
          <p className="text-lg text-slate-300">
            Founded in 2025, our network brings together over 5,000 graduates spanning six decades, 
            from recent graduates to distinguished professionals across various fields.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center transition-all hover:shadow-blue-900/20 bg-slate-800 border-slate-700 text-white hover:-translate-y-1">
              <div className="mb-4 rounded-full bg-slate-900/70 p-3">{benefit.icon}</div>
              <h3 className="mb-2 text-xl font-medium text-white">{benefit.title}</h3>
              <p className="text-slate-300">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}