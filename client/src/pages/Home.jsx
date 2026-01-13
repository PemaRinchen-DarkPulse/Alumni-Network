import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import Hello from '@/components/shared/sections/DashboardSection';
// Import layout components directly
import DashboardNavbar from '@/components/shared/layout/DashboardNavbar';
import PageHeader from '@/components/shared/layout/PageHeader';

// Import section components directly
import EventsPage from './EventsPage';
import MediaGallerySection from '@/components/shared/sections/Collaboration';
import FeedbackSection from '@/components/shared/sections/FeedbackSection';
import TributeSection from '@/components/shared/sections/TributeSection';
import ForumSection from '@/components/shared/sections/ForumSection';
import BlogSection from '@/components/shared/sections/BlogSection';

// Import mentorship components directly
import MentorshipRouter from '@/components/shared/sections/MentorshipRouter';
import SettingsPage from '@/components/settings/SettingsPage';

// Import page components
import Network from './Network';
import AlumniDetailPage from './AlumniDetailPage';
import BlogListPage from './BlogListPage';
import CreateBlogPage from './CreateBlogPage';
import MyNetwork from '@/components/shared/sections/MyNetwork';
import CreateEventPage from './CreateEventPage';
import FindProjects from './FindProjects';
import CreateNewProject from './CreateNewProject';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  console.log("Dashboard loaded, auth status:", { isAuthenticated, user });
  const userRole = user?.role || 'teacher'; // Default to teacher

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <DashboardNavbar />
      
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">            <Routes>
              {/* Main Dashboard Route */}
              <Route path="/" element={<Hello />} />
              
              {/* Routes common to all user types using shared components */}
              <Route path="/directory" element={<Network />} />
              <Route path="/my-network" element={<MyNetwork />} />
              <Route path="/alumni/:id" element={<AlumniDetailPage />} />
          
              
              {/* Legacy blog section route */}
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/create" element={<CreateBlogPage />} />
              
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              
              <Route path="/media" element={
                <MediaGallerySection/>
              } />
              <Route path="/find-projects" element={<FindProjects />} />
              <Route path="/create-new-project" element={<CreateNewProject />} />
                <Route path="/tribute" element={
                <TributeSection />
              } />
              
              {/* Alumni specific routes */}
              {userRole === 'alumni' && (
                <>
                  <Route path="/mentorship" element={
                    <MentorshipRouter/>
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
                </>
              )}
                  {/* Student specific routes */}
              {userRole === 'student' && (
                <Route path="/mentorship" element={
                  <MentorshipRouter/>
                } />
              )}
                {/* Settings route available for all roles */}
              <Route path="/settings" element={
                <div className="w-full">
                  <PageHeader 
                    title="Settings & Profile" 
                    description="Manage your account settings and profile information"
                    icon="settings"
                    gradient="from-gray-600 to-gray-800"
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