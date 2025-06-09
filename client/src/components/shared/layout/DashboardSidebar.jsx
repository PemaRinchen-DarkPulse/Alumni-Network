import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import Icon from '@/components/shared/icons/Icon';

const DashboardSidebar = ({ isExpanded }) => {
  const { user } = useAuth();
  
  // Default links (can be customized based on user.role if available)
  const userRole = user?.role || 'teacher'; // Default to teacher if no role specified
  const isMentor = user?.isMentor || false; // Check if user is a mentor
  // Define sidebar links by role
  const sidebarLinks = {
    teacher: [
      { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Alumni Directory', path: '/dashboard/directory', icon: 'users' },
      { name: 'Blog Section', path: '/dashboard/blog', icon: 'file-text' },
      { name: 'Events', path: '/dashboard/events', icon: 'calendar' },
      { name: 'Photos & Videos', path: '/dashboard/media', icon: 'image' },
      { name: 'Discussion Forum', path: '/dashboard/forum', icon: 'message-square' },
      { name: 'Tribute to Teachers', path: '/dashboard/tribute', icon: 'award' },
      { name: 'Alumni Feedback', path: '/dashboard/feedback', icon: 'thumbs-up' },
      { name: 'Collaboration', path: '/dashboard/collaboration', icon: 'handshake' },
    ],    
    student: [
      { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Alumni Directory', path: '/dashboard/directory', icon: 'users' },
      { name: 'Alumni Blog', path: '/dashboard/blog', icon: 'file-text' },
      { name: 'Request Mentorship', path: '/dashboard/mentorship', icon: 'user-plus' },
      { name: 'Events', path: '/dashboard/events', icon: 'calendar' },
      { name: 'Photos & Videos', path: '/dashboard/media', icon: 'image' },
      { name: 'Tribute to Teachers', path: '/dashboard/tribute', icon: 'award' },
    ],
    alumni: [
      { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Alumni Directory', path: '/dashboard/directory', icon: 'users' },
      { name: 'Alumni Blog', path: '/dashboard/blog', icon: 'file-text' },
      { name: 'Mentorship', path: '/dashboard/mentorship', icon: 'user-plus' },
      { name: 'Events', path: '/dashboard/events', icon: 'calendar' },
      { name: 'Photos & Videos', path: '/dashboard/media', icon: 'image' },
      { name: 'Discussion Forum', path: '/dashboard/forum', icon: 'message-square' },
      { name: 'Tribute to Teachers', path: '/dashboard/tribute', icon: 'award' },
    ]
  };
  
  // Get links based on user role
  let links = sidebarLinks[userRole] || sidebarLinks.teacher;
    // Filter out mentorship option if user is not a mentor and is an alumni
  // Students always see mentorship option since they're requesting mentorship
  if (userRole === 'alumni' && !isMentor) {
    links = links.filter(link => link.name !== 'Mentorship');
  }return (
    <aside 
      className={cn(
        "fixed left-0 top-20 z-30 flex h-[calc(100vh-5rem)] flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-900",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col p-3 gap-1">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="flex items-center rounded-md px-3 py-3 text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
          >
            <Icon name={link.icon} size={22} />
            {isExpanded && <span className="ml-3 text-base">{link.name}</span>}
          </Link>
        ))}      </div>      <div className="mt-auto p-3">
          
          <SignOutButton isExpanded={isExpanded} />
      </div>
    </aside>
  );
};

// Sign Out Button component
const SignOutButton = ({ isExpanded }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
    const handleSignOut = () => {
    logout(navigate);
  };
    return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center rounded-md px-3 py-3 text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-800"
    >
      <Icon name="logout" size={20} />
      {isExpanded && <span className="ml-3 text-base">Sign Out</span>}
    </button>
  );
};

export default DashboardSidebar;
