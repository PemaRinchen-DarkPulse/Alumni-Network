import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/shared/icons/Icon";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 md:py-20 lg:py-28 text-white">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* School building silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-purple-900/10 md:h-32"></div>
        
        {/* Abstract network lines representing alumni connections */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
          <pattern id="networkGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M100 0 L0 100 M150 0 L0 150 M50 0 L0 50 M100 50 L50 100 M150 50 L50 150" 
                  stroke="white" strokeWidth="0.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#networkGrid)" />
        </svg>
        
        {/* Animated gradient circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-purple-500 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-indigo-500 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          {/* Graduation cap icon */}
        <div className="absolute top-20 left-10 opacity-10">
          <Icon name="graduation-cap" size={120} strokeWidth={1} />
        </div>
        
        {/* Handshake icon */}
        <div className="absolute bottom-20 right-10 opacity-10">
          <Icon name="handshake" size={120} strokeWidth={1} />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center lg:gap-12">          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">Central High</span> Alumni Network
          </h1>
          
          <p className="max-w-3xl text-lg md:text-xl text-white">
            Reconnect with classmates, mentor juniors, and stay engaged with your 
            alma mater through events, mentorship programs, and networking opportunities.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-none font-medium">
              Join the Network
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-secondary text-secondary-foreground hover:bg-secondary/10 font-medium">
              Learn More
            </Button>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-white">              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>5000+ Alumni</span>
              </div>
              <Separator orientation="vertical" className="h-5 bg-slate-700" />              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>100+ Events Yearly</span>
              </div>
              <Separator orientation="vertical" className="h-5 hidden sm:block bg-slate-700" />
              <div className="flex items-center gap-2">                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Active Mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}