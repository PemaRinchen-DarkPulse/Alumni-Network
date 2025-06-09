import { Separator } from "@/components/ui/separator";
import { Icon } from "../icons/Icon";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-100">Central High Alumni Network</h3>
            <p className="text-sm text-slate-400">
              Connecting graduates, supporting students, and strengthening our school community.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-sm">              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Events</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Members Directory</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-100">Programs</h4>
            <ul className="space-y-2 text-sm">              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Mentorship</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Scholarships</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Career Support</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Fundraising</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-100">Connect</h4>
            <ul className="space-y-2 text-sm">              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-800" />
        
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Central High School Alumni Network. All rights reserved.
          </p>
            <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-primary transition-colors">
              <Icon name="facebook" size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-primary transition-colors">
              <Icon name="twitter" size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-primary transition-colors">
              <Icon name="instagram" size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-primary transition-colors">
              <Icon name="linkedin" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}