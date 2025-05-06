import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DGI Alumni Connect
          </Link>
        </div>
        
        <nav className="hidden space-x-6 md:flex">
          <Link to="/" className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400">
            Home
          </Link>
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
          {isAuthenticated ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-300">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700" role="menuitem">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
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
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-blue-400">
              Home
            </Link>
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
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-blue-400">
                  Profile
                </Link>
                <Button 
                  size="sm" 
                  className="mt-2 w-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" className="mt-2 w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" variant="outline" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}