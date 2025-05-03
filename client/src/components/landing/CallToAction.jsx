import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Join Your Alumni Community?
          </h2>
          <p className="max-w-2xl text-lg text-white">
            Sign up today to reconnect with classmates, mentor students, and stay involved 
            with your school community. Membership is free for all graduates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="rounded-full bg-white text-blue-700 hover:bg-blue-50 font-medium">
              Create Account
            </Button>
            <Button size="lg" className="rounded-full bg-transparent border-2 border-white text-white hover:bg-white/20 font-medium ring-2 ring-white/50">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}