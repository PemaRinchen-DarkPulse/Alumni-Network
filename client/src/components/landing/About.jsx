import { Card } from "@/components/ui/card";
import { Icon } from "@/components/shared/icons/Icon";

export function About() {
  const benefits = [    {
      title: "Networking",
      description: "Expand your professional connections with fellow alumni in various industries and locations around the world.",
      icon: <Icon name="users" size={24} className="text-primary" />,
    },
    {
      title: "Career Growth",
      description: "Access exclusive job opportunities, career advice, and professional development resources shared by alumni.",
      icon: <Icon name="bar-chart" size={24} className="text-primary" />,
    },
    {
      title: "Giving Back",
      description: "Mentor current students, volunteer at school events, and contribute to scholarship funds for the next generation.",
      icon: <Icon name="heart" size={24} className="text-primary" />,
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
          {benefits.map((benefit, index) => (            <Card key={index} className="flex flex-col items-center p-6 text-center transition-all hover:shadow-primary/20 bg-secondary border-secondary-foreground/20 text-secondary-foreground hover:-translate-y-1">
              <div className="mb-4 rounded-full bg-secondary-foreground/10 p-3">{benefit.icon}</div>
              <h3 className="mb-2 text-xl font-medium text-secondary-foreground">{benefit.title}</h3>
              <p className="text-secondary-foreground/80">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}