import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/shared/icons/Icon';

// Import layout components directly
import DashboardNavbar from '@/components/shared/layout/DashboardNavbar';
import DashboardSidebar from '@/components/shared/layout/DashboardSidebar';
import PageHeader from '@/components/shared/layout/PageHeader';

// Import section components directly
import BlogSection from '@/components/shared/sections/BlogSection';
import EventsSection from '@/components/shared/sections/EventsSection';
import MediaGallerySection from '@/components/shared/sections/MediaGallerySection';
import FeedbackSection from '@/components/shared/sections/FeedbackSection';
import TributeSection from '@/components/shared/sections/TributeSection';
import ForumSection from '@/components/shared/sections/ForumSection';
import CollaborationSection from '@/components/shared/sections/CollaborationSection';

// Import mentorship components directly
import MentorshipRequestSection from '@/components/shared/mentorship/MentorshipRequestSection';
import MentorshipManagementSection from '@/components/shared/mentorship/MentorshipManagementSection';

// Import card components directly
import ContentCard from '@/components/shared/cards/ContentCard';
import DashboardCard from '@/components/shared/cards/DashboardCard';
import SettingsPage from '@/components/settings/SettingsPage';

// Import page components
import DirectoryPage from './DirectoryPage';
import AlumniDetailPage from './AlumniDetailPage';

const Dashboard = () => {
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
              <Route path="/" element={<DashboardHome user={user} userRole={userRole} />} />
              
              {/* Routes common to all user types using shared components */}
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/alumni/:id" element={<AlumniDetailPage />} />
              
              <Route path="/blog" element={
                <BlogSection 
                  title={`${userRole === 'teacher' ? 'Blog Management' : 'Alumni Blog'}`}
                  description={userRole === 'teacher' 
                    ? "Manage and moderate blog content."
                    : userRole === 'student'
                      ? "Read stories and insights from graduates."
                      : "Share your stories, experiences, and insights with the alumni community."
                  }
                  posts={[]} // This would be populated with real data
                  onPostClick={(post) => console.log('View post:', post)}
                  showAddPost={userRole === 'alumni' || userRole === 'teacher'}
                  onAddPost={() => console.log('Add new post')}
                />
              } />
              
              <Route path="/events" element={
                <EventsSection 
                  title={`${userRole === 'teacher' ? 'Event Management' : userRole === 'student' ? 'Events' : 'Alumni Events'}`}
                  description={userRole === 'teacher'
                    ? "Create and manage events for alumni and students." 
                    : userRole === 'student'
                      ? "Discover events organized by alumni and the institution."
                      : "Stay updated with upcoming alumni events and reunions."
                  }
                  events={[]} // This would be populated with real data
                  onRegister={(event) => console.log('Register for event:', event)}
                />
              } />
              
              <Route path="/media" element={
                <MediaGallerySection 
                  title="Photos & Videos"
                  description={userRole === 'teacher'
                    ? "Manage photos and videos of school events and activities." 
                    : userRole === 'student'
                      ? "View photos and videos from alumni events and campus life."
                      : "Share and browse memories from your time at the institution."
                  }
                  mediaItems={[]} // This would be populated with real data
                  onMediaClick={(item) => console.log('View media:', item)}
                  showUpload={userRole === 'alumni' || userRole === 'teacher'}
                />
              } />
                <Route path="/tribute" element={
                <TributeSection 
                  title="Tribute to Teachers"
                  description="Honor and appreciate the educators who made a difference."
                  tributes={[]} // This would be populated with real data
                  showSubmitForm={userRole !== 'teacher'} // Teachers only view tributes, not submit
                />
              } />
              
              {/* Alumni specific routes */}
              {userRole === 'alumni' && (
                <>
                  <Route path="/mentorship" element={
                    <MentorshipManagementSection 
                      requests={[]} // This would be populated with real data
                      mentees={[]} // This would be populated with real data
                      onAcceptRequest={(request) => console.log('Accept request:', request)}
                      onRejectRequest={(request) => console.log('Reject request:', request)}
                      onScheduleSession={(mentee) => console.log('Schedule session with:', mentee)}
                    />
                  } />
                    <Route path="/forum" element={
                    <ForumSection 
                      title="Discussion Forum"
                      description="Engage in discussions with fellow alumni on various topics."
                      discussions={[]} // This would be populated with real data
                      canModerate={false}
                      canCreateThreads={true}
                    />
                  } />
                </>
              )}
              
              {/* Teacher specific routes */}
              {userRole === 'teacher' && (
                <>                  <Route path="/forum" element={
                    <ForumSection 
                      title="Discussion Forum"
                      description="Monitor and facilitate discussions among alumni."
                      discussions={[]} // This would be populated with real data
                      canModerate={true}
                      canCreateThreads={true}
                    />
                  } />
                  
                  <Route path="/feedback" element={
                    <FeedbackSection 
                      title="Alumni Feedback"
                      description="View and respond to feedback from alumni."
                      feedbackItems={[]} // This would be populated with real data
                      showSubmitForm={false} // Teachers only view feedback, not submit
                    />
                  } />
                    <Route path="/collaboration" element={
                    <CollaborationSection 
                      title="Collaboration Opportunities"
                      description="Manage partnerships between the institution and alumni."
                      opportunities={[]} // This would be populated with real data
                      isAdmin={true} // Teachers are admins
                    />
                  } />
                </>
              )}
                  {/* Student specific routes */}
              {userRole === 'student' && (
                <Route path="/mentorship" element={
                  <MentorshipRequestSection 
                    mentors={[]} // This would be populated with real data
                    onRequestMentorship={(data) => console.log('Request mentorship:', data)}
                  />
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

// DashboardCard is now imported from shared components

// Dashboard Home page component
const DashboardHome = ({ user, userRole }) => {
  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user?.name || 'User'}! (${userRole})`}
      />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">        <DashboardCard 
          title="Quick Stats"
          description="View your key performance indicators"
          icon={<Icon name="bar-chart" size={24} />}
        />
        
        <DashboardCard 
          title="Recent Announcements"
          description="Stay updated with the latest news"
          icon={<Icon name="chevrons-up-down" size={24} />}
        />
        
        <DashboardCard 
          title="Upcoming Events"
          description="Don't miss important dates"
          icon={<Icon name="calendar" size={24} />}
        />
        
        <DashboardCard 
          title="Alumni Directory"
          description="Connect with alumni from your institution"
          icon={<Icon name="users" size={24} />}
          link="/dashboard/directory"
        /></div>
      
      <div className="mt-8">
        <ContentCard>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {userRole === 'teacher' ? 'Teacher Dashboard' : 
             userRole === 'student' ? 'Student Dashboard' : 
             'Alumni Dashboard'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            This is a customized dashboard for {userRole}s. The content here will change based on your role.
          </p>
        </ContentCard>
      </div>
    </>
  );
};

// All legacy components have been replaced with reusable components

export default Dashboard;