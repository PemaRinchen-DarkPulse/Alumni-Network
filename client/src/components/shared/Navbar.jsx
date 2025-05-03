import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <a href="#" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DGI Alumni Connect
          </a>
        </div>
        
        <nav className="hidden space-x-6 md:flex">
          <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            Home
          </a>
          <a href="#about" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            About
          </a>
          <a href="#events" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            Events
          </a>
          <a href="#testimonials" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            Success Stories
          </a>
          <a href="#contact" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            Contact
          </a>
        </nav>
        
        <div className="hidden md:flex space-x-2">
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Sign Up</Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none">Sign In</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container mx-auto border-t border-slate-800 px-4 py-2 md:hidden bg-slate-900">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              Home
            </a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              About
            </a>
            <a href="#events" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              Events
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              Success Stories
            </a>
            <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              Contact
            </a>
            <Button size="sm" className="mt-2 w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" variant="outline">Sign Up</Button>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none">Sign In</Button>
          </nav>
        </div>
      )}
    </header>
  );
}