import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';

const DashboardNavbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // User role based nav links
  const userRole = user?.role || 'teacher'; // Default to teacher if no role specified
  
  const navLinks = {
    teacher: [
      { name: 'Teacher Nav Link 1', path: '/dashboard/grades' },
      { name: 'Teacher Nav Link 2', path: '/dashboard/assignments' },
      { name: 'Teacher Nav Link 3', path: '/dashboard/resources' },
    ],
    student: [
      { name: 'Student Nav Link 1', path: '/dashboard/assignments' },
      { name: 'Student Nav Link 2', path: '/dashboard/resources' },
      { name: 'Student Nav Link 3', path: '/dashboard/grades' },
    ],
    alumni: [
      { name: 'Alumni Nav Link 1', path: '/dashboard/jobs' },
      { name: 'Alumni Nav Link 2', path: '/dashboard/mentorship' },
      { name: 'Alumni Nav Link 3', path: '/dashboard/network' },
    ]
  };

  // Get links based on user role
  const links = navLinks[userRole] || navLinks.teacher;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  const handleLogout = () => {
    logout(navigate);
    setIsDropdownOpen(false);
  };return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto flex h-20 items-center px-4">        <button 
          onClick={toggleSidebar}
          className="mr-3 flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center text-xl font-bold text-primary">
          DGI Alumni Connect
        </div>

        <nav className="hidden md:ml-auto md:flex md:items-center md:gap-6">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>        <div className="ml-auto flex items-center gap-3">
          <Button
            size="lg"
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 text-slate-600 dark:text-slate-300"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="User menu"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </button>
              {isDropdownOpen && (              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p className="text-md font-medium">{user?.name || 'User'}</p>
                  <p className="mt-1 text-sm font-medium capitalize text-primary">{userRole}</p>
                </div><Link
                  to="/dashboard/settings"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings & Profile
                </Link><button
                  className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
