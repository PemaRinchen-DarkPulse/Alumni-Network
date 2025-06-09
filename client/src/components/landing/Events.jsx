import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/shared/icons/Icon";

export function Events() {
  const events = [
    {
      title: "Class of 2015 Reunion",
      date: "May 15, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "Central High School Auditorium",
      description: "Join your classmates to celebrate 10 years since graduation! Dinner, dancing, and memories await.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      title: "Alumni Networking Mixer",
      date: "June 7, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Downtown Business Club",
      description: "Connect with fellow alumni across different industries. Great opportunity for career networking.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      title: "Career Mentorship Webinar",
      date: "June 21, 2025",
      time: "1:00 PM - 2:30 PM",
      location: "Online (Zoom)",
      description: "Learn how to become a mentor to current students and help guide their career choices.",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
    {
      title: "Annual Homecoming Celebration",
      date: "October 10, 2025",
      time: "All Day",
      location: "Central High Campus",
      description: "The biggest alumni event of the year! Sports, performances, and reconnecting with old friends.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    },
  ];

  // Get only the first three events
  const displayedEvents = events.slice(0, 3);

  return (
    <section id="events" className="bg-slate-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">Upcoming Events</h2>
          <p className="mx-auto max-w-3xl text-white md:text-lg">
            Stay connected with your alma mater through our exciting lineup of alumni events, reunions, and networking opportunities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {displayedEvents.map((event, index) => (
            <Card key={index} className="overflow-hidden bg-slate-800 border-slate-700 shadow-lg">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-semibold text-white">{event.title}</h3>                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                    <div className="flex items-center">
                      <Icon name="calendar" size={16} className="mr-1 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Icon name="clock" size={16} className="mr-1 text-primary" />
                      {event.time}
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-slate-700" />
                    <div className="mb-4 flex items-center text-sm text-slate-300">
                    <Icon name="map-pin" size={16} className="mr-2 text-primary" />
                    {event.location}
                  </div>
                  
                  <p className="text-slate-300">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">View Details</Button>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none">RSVP Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}