import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSidebar = ({ isExpanded }) => {
  const { user } = useAuth();
  
  // Default links (can be customized based on user.role if available)
  const userRole = user?.role || 'teacher'; // Default to teacher if no role specified
  const isMentor = user?.isMentor || false; // Check if user is a mentor
    // Define sidebar links by role  // Define sidebar links by role
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
    ],    student: [
      { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Alumni Directory', path: '/dashboard/directory', icon: 'users' },
      { name: 'Alumni Blog', path: '/dashboard/blog', icon: 'file-text' },
      { name: 'Request Mentorship', path: '/dashboard/mentorship', icon: 'user-plus' },
      { name: 'Events', path: '/dashboard/events', icon: 'calendar' },
      { name: 'Photos & Videos', path: '/dashboard/media', icon: 'image' },
      { name: 'Tribute to Teachers', path: '/dashboard/tribute', icon: 'award' },
    ],alumni: [
      { name: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Alumni Directory', path: '/dashboard/directory', icon: 'users' },
      { name: 'Alumni Blog', path: '/dashboard/blog', icon: 'file-text' },
      { name: 'Mentorship', path: '/dashboard/mentorship', icon: 'user-plus' },
      { name: 'Events', path: '/dashboard/events', icon: 'calendar' },
      { name: 'Photos & Videos', path: '/dashboard/media', icon: 'image' },
      { name: 'Discussion Forum', path: '/dashboard/forum', icon: 'message-square' },
      { name: 'Tribute to Teachers', path: '/dashboard/tribute', icon: 'award' }
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
            <SidebarIcon name={link.icon} />
            {isExpanded && <span className="ml-3 text-base">{link.name}</span>}
          </Link>
        ))}      </div>
      <div className="mt-auto p-3">
        <Link
          to="/profile"
          className="flex items-center rounded-md px-3 py-3 text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
        >
          <SidebarIcon name="user" />
          {isExpanded && <span className="ml-3 text-base">Profile</span>}
        </Link>        {/* For alumni only: Show "Become a Mentor" button if they are not mentors */}
      
        
        <Link
          to="/settings"
          className="flex items-center rounded-md px-3 py-3 text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
        >
          <SidebarIcon name="settings" />
          {isExpanded && <span className="ml-3 text-base">Settings</span>}
        </Link>
      </div>
    </aside>
  );
};

// Simple icon component based on icon name
const SidebarIcon = ({ name }) => {
  const icons = {
    'layout-dashboard': (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
    'users': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    'file-text': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    'user-plus': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    'image': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    'message-square': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    'book-open': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    'award': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    'calendar': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    'user': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),    'settings': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    'handshake': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
        <path d="M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3 0l2.26-2.21a2.13 2.13 0 0 1 3 0h0a2.13 2.13 0 0 1 0 3l-5.3 5.3" />
      </svg>
    ),
    'thumbs-up': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    )
  };
  
  return icons[name] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

export default DashboardSidebar;
