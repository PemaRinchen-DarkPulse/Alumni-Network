import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import ProfileSection from './ProfileSection';
import PasswordSection from './PasswordSection';
import NotificationsSection from './NotificationsSection';
import PrivacySection from './PrivacySection';
import HelpSupportSection from './HelpSupportSection';
import NetworkingSection from './NetworkingSection';
import ActivitySection from './ActivitySection';
import { Card } from '@/components/ui/card';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Calculate profile completion percentage
  useEffect(() => {
    if (user) {
      // Define required fields for each role
      const commonFields = ['name', 'email', 'phone', 'address', 'bio', 'profilePicture'];
      const studentFields = [...commonFields, 'batch', 'parentGuardianContact'];
      const alumniFields = [...commonFields, 'batch', 'currentOccupation'];
      const teacherFields = [...commonFields, 'subjectsTaught'];
      
      // Select appropriate fields based on user role
      let requiredFields = commonFields;
      if (user.role === 'student') requiredFields = studentFields;
      if (user.role === 'alumni') requiredFields = alumniFields;
      if (user.role === 'teacher') requiredFields = teacherFields;
      
      // Count completed fields
      let completedFields = 0;
      requiredFields.forEach(field => {
        if (field === 'subjectsTaught' && user[field] && user[field].length > 0) {
          completedFields++;
        } else if (
          field === 'socialLinks' && 
          user[field] && 
          Object.values(user[field]).some(link => link && link.trim() !== '')
        ) {
          completedFields++;
        } else if (user[field] && String(user[field]).trim() !== '') {
          completedFields++;
        }
      });
      
      // Calculate percentage
      const percentage = Math.round((completedFields / requiredFields.length) * 100);
      setProfileCompletion(percentage);
    }
  }, [user]);

  return (
    <div className="space-y-6">

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
          {user?.role === 'alumni' && <TabsTrigger value="networking">Networking</TabsTrigger>}
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordSection />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsSection />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySection />
          </TabsContent>
          
          <TabsContent value="help">
            <HelpSupportSection />
          </TabsContent>
          
          {user?.role === 'alumni' && (
            <TabsContent value="networking">
              <NetworkingSection />
            </TabsContent>
          )}
          
          <TabsContent value="activity">
            <ActivitySection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
