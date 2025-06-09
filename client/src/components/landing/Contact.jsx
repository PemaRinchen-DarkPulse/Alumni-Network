import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/shared/icons/Icon";

export function Contact() {
  return (
    <section id="contact" className="bg-slate-900 py-16 md:py-24 text-slate-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-white">
            Have questions about the Alumni Network? Want to organize an event or volunteer? 
            We'd love to hear from you! Reach out using any of the methods below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6 md:p-8 bg-slate-800 border-slate-700 shadow-lg hover:shadow-blue-900/20 transition-all">
            <h3 className="mb-6 text-xl font-semibold text-white">Get in Touch</h3>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium text-white">
                    First Name
                  </label>
                  <input
                    id="first-name"                  placeholder="John"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 placeholder:text-slate-400 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium text-white">
                    Last Name
                  </label>
                  <input
                    id="last-name"                  placeholder="Doe"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 placeholder:text-slate-400 text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  type="email"                  placeholder="john.doe@example.com"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 placeholder:text-slate-400 text-white focus:border-primary focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="graduation-year" className="text-sm font-medium text-white">
                  Graduation Year
                </label>
                <input
                  id="graduation-year"
                  type="number"                  placeholder="2010"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 placeholder:text-slate-400 text-white focus:border-primary focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white">
                  Message
                </label>
                <textarea
                  id="message"                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 placeholder:text-slate-400 text-white focus:border-primary focus:outline-none"
                ></textarea>
              </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                Send Message
              </Button>
            </form>
          </Card>
          
          <div className="overflow-hidden rounded-lg shadow-lg border border-slate-700">
            <div className="h-full w-full min-h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17538.211576703965!2d89.44296635746562!3d27.32850269769534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e18300666868a7%3A0x1bd738cb644205f1!2sDungkar%20Dzong!5e0!3m2!1sen!2sin!4v1746302827559!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                className="min-h-[400px]"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Alumni Network Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 container mx-auto px-4">
          <Card className="overflow-hidden rounded-lg bg-slate-800 border-slate-700 shadow-lg transition-all hover:shadow-blue-900/20 hover:translate-y-[-4px]">            <div className="flex p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon name="phone" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-white">Phone</h4>
                <p className="text-sm text-primary hover:text-primary/80 transition-colors">04 2416 1234</p>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden rounded-lg bg-slate-800 border-slate-700 shadow-lg transition-all hover:shadow-blue-900/20 hover:translate-y-[-4px]">            <div className="flex p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon name="mail" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-white">Email</h4>
                <p className="text-sm text-primary hover:text-primary/80 transition-colors">alumni@centralhigh.edu</p>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden rounded-lg bg-slate-800 border-slate-700 shadow-lg transition-all hover:shadow-blue-900/20 hover:translate-y-[-4px]">            <div className="flex p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon name="printer" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-white">FAX</h4>
                <p className="text-sm text-primary hover:text-primary/80 transition-colors">02 6212 1234</p>
              </div>
            </div>
          </Card>
        </div>
    </section>
  );
}