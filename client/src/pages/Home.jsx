import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { cn } from '@/lib/utils';
import Hello from '@/components/shared/sections/DashboardSection';
// Import layout components directly
import DashboardNavbar from '@/components/shared/layout/DashboardNavbar';
import DashboardSidebar from '@/components/shared/layout/DashboardSidebar';
import PageHeader from '@/components/shared/layout/PageHeader';

// Import section components directly
import EventsSection from '@/components/shared/sections/EventsSection';
import MediaGallerySection from '@/components/shared/sections/MediaGallerySection';
import FeedbackSection from '@/components/shared/sections/FeedbackSection';
import TributeSection from '@/components/shared/sections/TributeSection';
import ForumSection from '@/components/shared/sections/ForumSection';
import CollaborationSection from '@/components/shared/sections/CollaborationSection';
import BlogSection from '@/components/shared/sections/BlogSection';

// Import mentorship components directly
import MentorshipManagementSection from '@/components/shared/sections/MentorshipManagementSection';
import SettingsPage from '@/components/settings/SettingsPage';

// Import page components
import DirectoryPage from './DirectoryPage';
import AlumniDetailPage from './AlumniDetailPage';

const Home = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { user, isAuthenticated } = useAuth();
  console.log("Dashboard loaded, auth status:", { isAuthenticated, user });
  const userRole = user?.role || 'teacher'; // Default to teacher

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />        <main 
          className={cn(
            "flex-1 p-6 transition-all duration-300",
            sidebarExpanded ? "ml-64" : "ml-16"
          )}
        >
          <div className="mx-auto max-w-7xl">            <Routes>
              {/* Main Dashboard Route */}
              <Route path="/" element={<Hello />} />
              
              {/* Routes common to all user types using shared components */}
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/alumni/:id" element={<AlumniDetailPage />} />
          
              
              {/* Legacy blog section route */}
              <Route path="/blog" element={
                <BlogSection/>
              } />
              
              <Route path="/events" element={
                <EventsSection/>
              } />
              
              <Route path="/media" element={
                <MediaGallerySection/>
              } />
                <Route path="/tribute" element={
                <TributeSection />
              } />
              
              {/* Alumni specific routes */}
              {userRole === 'alumni' && (
                <>
                  <Route path="/mentorship" element={
                    <MentorshipManagementSection/>
                  } />
                    <Route path="/forum" element={
                    <ForumSection/>
                  } />
                </>
              )}
              
              {/* Teacher specific routes */}
              {userRole === 'teacher' && (
                <>                  <Route path="/forum" element={
                    <ForumSection/>
                  } />
                  
                  <Route path="/feedback" element={
                    <FeedbackSection />
                  } />
                    <Route path="/collaboration" element={
                    <CollaborationSection/>
                  } />
                </>
              )}
                  {/* Student specific routes */}
              {userRole === 'student' && (
                <Route path="/mentorship" element={
                  <MentorshipManagementSection/>
                } />
              )}
                {/* Settings route available for all roles */}
              <Route path="/settings" element={
                <div className="w-full">
                  <PageHeader 
                    title="Settings & Profile" 
                    description="Manage your account settings and profile information"
                  />
                  <div className="mt-6">
                    <SettingsPage />
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;