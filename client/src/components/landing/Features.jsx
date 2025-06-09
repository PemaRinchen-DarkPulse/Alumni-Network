import { Card } from "@/components/ui/card";
import Icon from "@/components/shared/icons/Icon";

export function Features() {  const features = [
    {
      title: "Connect with Classmates",
      description: "Find and reconnect with former classmates, build your network, and stay in touch with friends from your school days.",
      icon: <Icon name="users" size={24} className="text-blue-400" />,
    },
    {
      title: "Mentor Junior Students",
      description: "Share your experience and knowledge with current students, help guide their careers, and make a meaningful impact.",
      icon: <Icon name="edit" size={24} className="text-blue-400" />,
    },
    {
      title: "Attend School Events",
      description: "Stay informed about reunions, homecomings, fundraisers, and special events happening at your alma mater.",
      icon: <Icon name="calendar" size={24} className="text-blue-400" />,
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