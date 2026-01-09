import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Icon } from '../icons/Icon';

const DashboardNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Debug logging to see user data in navbar
  console.log('DashboardNavbar - user object:', user);
  console.log('DashboardNavbar - user.profilePicture:', user?.profilePicture);
  
  // User role based nav links
  const userRole = user?.role || 'teacher'; // Default to teacher if no role specified
  
  const navLinks = {
    teacher: [
      { name: 'Network', path: '/dashboard/directory' },
      { name: 'Events', path: '/dashboard/events' },
      { name: 'Nexus', path: '/dashboard/media' },
      { name: 'Blog', path: '/dashboard/blog' },
      { name: 'Tribute', path: '/dashboard/tribute' },
      { name: 'Feedbacks', path: '/dashboard/feedbacks' },
    ],
    student: [
      { name: 'Network', path: '/dashboard/directory' },
      { name: 'Mentorship', path: '/dashboard/mentorship' },
      { name: 'Events', path: '/dashboard/events' },
      { name: 'Nexus', path: '/dashboard/media' },
      { name: 'Blogs', path: '/dashboard/blog' },
      { name: 'Tributes', path: '/dashboard/tribute' },
    ],
    alumni: [
      { name: 'Network', path: '/dashboard/directory' },
      { name: 'Mentorship', path: '/dashboard/mentorship' },
      { name: 'Events', path: '/dashboard/events' },
      { name: 'Nexus', path: '/dashboard/media' },
      { name: 'Blogs', path: '/dashboard/blog' },
      { name: 'Tributes', path: '/dashboard/tribute' },
    ]
  };
  // Get links based on user role
  const links = navLinks[userRole] || navLinks.teacher;

  const handleLogout = () => {
    logout(navigate);
    setIsDropdownOpen(false);
  };return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        {/* Logo - Left */}
        <div className="flex items-center text-xl font-bold text-primary ml-4">
          Alumni Network
        </div>

        {/* Navigation - Center */}
        {(userRole === 'alumni' || userRole === 'student' || userRole === 'teacher') && (
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-100 rounded-md transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Icons & Profile - Right */}
        <div className="flex items-center gap-4 mr-4">            <button 
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Icon name="bell" size={22} />
          </button>

          <button 
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Messages"
          >
            <Icon name="message-square" size={22} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="User menu"            >              <UserAvatar user={user} size="md" className="[&_[data-slot=avatar-fallback]]:bg-gray-200 [&_[data-slot=avatar-fallback]]:text-gray-700" />
            </button>
              {isDropdownOpen && (              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p className="text-md font-medium">{user?.name || 'User'}</p>
                  <p className="mt-1 text-sm font-medium capitalize text-primary">{userRole}</p>
                </div>

                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/dashboard/my-network"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Network
                </Link>

                <Link
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
