import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/auth';
import { mentorshipAPI } from '../../../services/api';
import MentorshipDashboard from './MentorshipDashboard';
import MentorshipManagementSection from './MentorshipManagementSection';
import FindMentorSection from './FindMentorSection';
import LoadingSpinner from '../../ui/LoadingSpinner';

/**
 * Router component that determines which mentorship view to show
 * - Students: Show Find a Mentor page
 * - Alumni with published profile: Show Mentorship Dashboard
 * - Alumni with draft/no profile: Show Setup Wizard
 */
const MentorshipRouter = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);

  useEffect(() => {
    const checkMentorshipProfile = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          setLoading(false);
          return;
        }

        // Fetch mentorship profile from API
        const result = await mentorshipAPI.getProfile(user.id);
        
        if (result.success && result.data) {
          // Check if profile status is 'published'
          setProfileStatus(result.data.status);
        } else {
          // No profile found
          setProfileStatus(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking mentorship profile:', error);
        setProfileStatus(null);
        setLoading(false);
      }
    };

    if (user && user.role === 'alumni') {
      checkMentorshipProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is student, show Find a Mentor page
  if (user?.role === 'student') {
    return <FindMentorSection />;
  }

  // If user is not alumni (teacher), redirect or show default
  if (user?.role !== 'alumni') {
    return <FindMentorSection />;
  }

  // If alumni has published profile, show dashboard
  if (profileStatus === 'published') {
    return <MentorshipDashboard />;
  }

  // Otherwise (draft or no profile), show setup wizard
  return <MentorshipManagementSection />;
};

export default MentorshipRouter;
