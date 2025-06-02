import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardNavbar from '../components/shared/DashboardNavbar';
import DashboardSidebar from '../components/shared/DashboardSidebar';
import { cn } from '@/lib/utils';

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
          <div className="mx-auto max-w-7xl">
            <Routes>
              {/* Main Dashboard Route */}
              <Route path="/" element={<DashboardHome user={user} userRole={userRole} />} />
              
              {/* Alumni specific routes */}
              {userRole === 'alumni' && (
                <>
                  <Route path="/directory" element={<AlumniDirectory />} />
                  <Route path="/blog" element={<AlumniBlog />} />
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/media" element={<MediaGallery />} />
                  <Route path="/forum" element={<DiscussionForum />} />
                  <Route path="/tribute" element={<TeacherTribute />} />
                </>              )}
              
              {/* Routes for other roles */}
              {userRole === 'teacher' && (
                <>
                  <Route path="/directory" element={<TeacherAlumniDirectory />} />
                  <Route path="/blog" element={<TeacherBlogSection />} />
                  <Route path="/events" element={<TeacherEvents />} />
                  <Route path="/media" element={<TeacherMediaGallery />} />
                  <Route path="/forum" element={<TeacherDiscussionForum />} />
                  <Route path="/tribute" element={<TeacherTribute />} />
                  <Route path="/feedback" element={<AlumniFeedback />} />
                  <Route path="/collaboration" element={<Collaboration />} />
                </>
              )}
                {userRole === 'student' && (
                <>
                  <Route path="/directory" element={<StudentAlumniDirectory />} />
                  <Route path="/blog" element={<StudentBlogSection />} />
                  <Route path="/mentorship" element={<StudentMentorship />} />
                  <Route path="/events" element={<StudentEvents />} />
                  <Route path="/media" element={<StudentMediaGallery />} />
                  <Route path="/tribute" element={<StudentTeacherTribute />} />

                </>
              )}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper component for dashboard cards
const DashboardCard = ({ title, description, icon }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home page component
const DashboardHome = ({ user, userRole }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Welcome back, {user?.name || 'User'}! ({userRole})
      </p>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Quick Stats"
          description="View your key performance indicators"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-6" />
            </svg>
          }
        />
        
        <DashboardCard 
          title="Recent Announcements"
          description="Stay updated with the latest news"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.5 9.5 12 6 8.5 9.5" />
              <path d="m8.5 14.5 3.5 3.5 3.5-3.5" />
            </svg>
          }
        />
        
        <DashboardCard 
          title="Upcoming Events"
          description="Don't miss important dates"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          }
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {userRole === 'teacher' ? 'Teacher Dashboard' : 
           userRole === 'student' ? 'Student Dashboard' : 
           'Alumni Dashboard'}
        </h2>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-400">
            This is a customized dashboard for {userRole}s. The content here will change based on your role.
          </p>
        </div>
      </div>
    </>
  );
};

// Alumni specific components
const AlumniDirectory = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Directory</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Connect with fellow alumni from your institution.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Search and connect with alumni based on graduation year, field of study, location, and more.
        </p>
      </div>
    </>
  );
};

const AlumniBlog = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Blog</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Share your stories, experiences, and insights with the alumni community.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Read the latest posts from your fellow alumni or create your own blog post.
        </p>
      </div>
    </>
  );
};

const Mentorship = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mentorship Program</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Connect with mentees and provide guidance as a mentor.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold mb-4">Your Mentees</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Manage your mentorship relationships, schedule meetings, and track progress of your mentees.
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
            <h3 className="font-medium">Mentorship Requests</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Students who have requested your mentorship
            </p>
            
            <div className="mt-3 border-t border-slate-200 dark:border-slate-600 pt-3">
              <p className="text-slate-600 dark:text-slate-400 italic">
                You'll see pending mentorship requests here.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
            <h3 className="font-medium">Active Mentorships</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your current mentorship relationships
            </p>
            
            <div className="mt-3 border-t border-slate-200 dark:border-slate-600 pt-3">
              <p className="text-slate-600 dark:text-slate-400 italic">
                Your active mentorships will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Events = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Events</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Stay updated with upcoming alumni events and reunions.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Browse upcoming events, register for attendance, and view past event galleries.
        </p>
      </div>
    </>
  );
};

const MediaGallery = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Photos & Videos</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Share and browse memories from your time at the institution.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Upload your own photos and videos or browse through media shared by other alumni.
        </p>
      </div>
    </>
  );
};

const DiscussionForum = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Discussion Forum</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Engage in discussions with fellow alumni on various topics.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Start new discussion threads, participate in ongoing discussions, and share your thoughts with the community.
        </p>
      </div>
    </>
  );
};

const TeacherTribute = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tribute to Teachers</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Honor and appreciate the educators who made a difference.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Share stories and tributes about teachers who have influenced your life and career.
        </p>
      </div>
    </>
  );
};

const BecomeMentor = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Become a Mentor</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Share your expertise and guide the next generation.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold mb-4">Mentor Application</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Area of Expertise
            </label>
            <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600">
              <option>Career Development</option>
              <option>Academic Guidance</option>
              <option>Professional Skills</option>
              <option>Industry Insights</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Years of Experience
            </label>
            <input type="number" min="1" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Why do you want to become a mentor?
            </label>
            <textarea rows="4" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"></textarea>
          </div>
          
          <div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Teacher specific components
const TeacherAlumniDirectory = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Directory</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        View and manage alumni information.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Browse alumni records, update information, and manage alumni connections.
        </p>
      </div>
    </>
  );
};

const TeacherBlogSection = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Management</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Manage and moderate blog content.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Review, approve, and feature blog posts from alumni and students.
        </p>
      </div>
    </>
  );
};

const TeacherEvents = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event Management</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Create and manage events for alumni and students.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Schedule events, manage registrations, and send invitations to alumni.
        </p>
      </div>
    </>
  );
};

const TeacherMediaGallery = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Media Gallery</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Manage photos and videos of school events and activities.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Upload, organize, and curate media content for the alumni community.
        </p>
      </div>
    </>
  );
};

const TeacherDiscussionForum = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Discussion Forum</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Monitor and facilitate discussions among alumni.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Moderate discussions, pin important topics, and engage with alumni in meaningful conversations.
        </p>
      </div>
    </>
  );
};

const AlumniFeedback = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Feedback</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        View and respond to feedback from alumni.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Review suggestions, address concerns, and use alumni input to improve the educational experience.
        </p>
      </div>
    </>
  );
};

const Collaboration = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Collaboration Opportunities</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Manage partnerships between the institution and alumni.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Coordinate guest lectures, research collaborations, internship opportunities, and other joint initiatives.
        </p>
      </div>
    </>
  );
};

// Student specific components
const StudentAlumniDirectory = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Directory</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Connect with graduates from your institution.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Browse alumni profiles and reach out to potential mentors and career connections.
        </p>
      </div>
    </>
  );
};

const StudentBlogSection = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alumni Blog</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Read stories and insights from graduates.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Learn from the experiences of alumni through their blog posts and articles.
        </p>
      </div>
    </>
  );
};

const StudentMentorship = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Request Mentorship</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Find and connect with alumni mentors for guidance.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold mb-4">Available Mentors</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Browse through alumni who have volunteered to be mentors and request mentorship based on your interests and career goals.
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
            <h3 className="font-medium">Mentorship Request Form</h3>
            <form className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Area of Interest
                </label>
                <select className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600">
                  <option>Career Guidance</option>
                  <option>Academic Support</option>
                  <option>Industry Insights</option>
                  <option>Professional Development</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Why are you seeking mentorship?
                </label>
                <textarea rows="3" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"></textarea>
              </div>
              
              <div>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const StudentEvents = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Discover events organized by alumni and the institution.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Browse upcoming networking events, workshops, and alumni gatherings.
        </p>
      </div>
    </>
  );
};

const StudentMediaGallery = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Photos & Videos</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        View photos and videos from alumni events and campus life.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Explore visual memories shared by alumni and the institution.
        </p>
      </div>
    </>
  );
};

const StudentTeacherTribute = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tribute to Teachers</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Read tributes to educators and share your own.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-slate-600 dark:text-slate-400">
          Express gratitude to teachers who have made an impact on your educational journey.
        </p>
      </div>
    </>
  );
};

export default Dashboard;