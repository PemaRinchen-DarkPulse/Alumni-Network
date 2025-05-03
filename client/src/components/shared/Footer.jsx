import { Separator } from "@/components/ui/separator";

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
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Events</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Members Directory</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-100">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Mentorship</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Scholarships</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Career Support</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Fundraising</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-100">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Support</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-800" />
        
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Central High School Alumni Network. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}