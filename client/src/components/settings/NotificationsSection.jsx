import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SectionLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/auth';

const NotificationsSection = () => {
  const { user } = useAuth();
    const [notificationSettings, setNotificationSettings] = useState({
    // Notification Methods
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Event Notifications
    eventReminders: true,
    eventUpdates: true,
    eventCancellations: true,
    
    // Mentorship Notifications
    mentorshipUpdates: false,
    mentorshipRequests: true,
    mentorshipReminders: true,
    
    // Content Notifications
    discussionReplies: false,
    blogUpdates: false,
    newPosts: false,
    comments: false,
    
    // System Notifications
    systemUpdates: true,
    securityAlerts: true,
    
    // Marketing Notifications
    marketingEmails: false,
    surveyRequests: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch notification settings
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const { getNotificationSettings } = await import('@/services/settingsService');
        const response = await getNotificationSettings();
        
        if (response.success && response.data) {
          setNotificationSettings(response.data.data || response.data);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to load notification settings' 
        });
      } finally {
        setInitialLoad(false);
      }
    };
    
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);
  // Handle toggle changes
  const handleToggle = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };
  
  // Save notification settings
  const saveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { updateNotificationSettings } = await import('@/services/settingsService');
      const response = await updateNotificationSettings(notificationSettings);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Notification settings saved successfully!' 
        });
        setHasChanges(false);
      } else {
        throw new Error(response.error || 'Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save notification settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { resetNotificationSettings } = await import('@/services/settingsService');
      const response = await resetNotificationSettings();
      
      if (response.success) {
        setNotificationSettings(response.data.data || response.data);
        setMessage({ 
          type: 'success', 
          text: 'Notification settings reset to default!' 
        });
        setHasChanges(false);
      } else {
        throw new Error(response.error || 'Failed to reset notification settings');
      }
    } catch (error) {
      console.error('Error resetting notification settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to reset notification settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return <SectionLoadingSpinner section="settings" message="Loading notification settings..." />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage how you receive notifications from the platform
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button 
                onClick={saveSettings} 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={resetToDefaults} 
              disabled={loading}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {message.text && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* Notification Methods */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Notification Methods</h3>
          
          <Switch
            id="pushNotifications"
            checked={notificationSettings.pushNotifications}
            onChange={(value) => handleToggle('pushNotifications', value)}
            label="Push Notifications"
            description="Receive notifications in your browser"
          />
          
          <Switch
            id="emailNotifications"
            checked={notificationSettings.emailNotifications}
            onChange={(value) => handleToggle('emailNotifications', value)}
            label="Email Notifications"
            description="Receive important updates via email"
          />

          <Switch
            id="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onChange={(value) => handleToggle('smsNotifications', value)}
            label="SMS Notifications"
            description="Receive urgent notifications via text message"
          />        </div>
        
        {/* Event Notifications */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Event Notifications</h3>
          
          <Switch
            id="eventReminders"
            checked={notificationSettings.eventReminders}
            onChange={(value) => handleToggle('eventReminders', value)}
            label="Event Reminders"
            description="Get reminders for upcoming events you've registered for"
          />

          <Switch
            id="eventUpdates"
            checked={notificationSettings.eventUpdates}
            onChange={(value) => handleToggle('eventUpdates', value)}
            label="Event Updates"
            description="Get notified when event details change"
          />

          <Switch
            id="eventCancellations"
            checked={notificationSettings.eventCancellations}
            onChange={(value) => handleToggle('eventCancellations', value)}
            label="Event Cancellations"
            description="Get notified when events are cancelled"
          />
        </div>
        
        {/* Mentorship Notifications */}
        {(user?.role === 'alumni' || user?.isMentor) && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Mentorship Notifications</h3>
            
            <Switch
              id="mentorshipRequests"
              checked={notificationSettings.mentorshipRequests}
              onChange={(value) => handleToggle('mentorshipRequests', value)}
              label="Mentorship Requests"
              description="Get notified about new mentorship requests"
            />

            <Switch
              id="mentorshipUpdates"
              checked={notificationSettings.mentorshipUpdates}
              onChange={(value) => handleToggle('mentorshipUpdates', value)}
              label="Mentorship Updates"
              description="Receive updates on mentorship sessions"
            />

            <Switch
              id="mentorshipReminders"
              checked={notificationSettings.mentorshipReminders}
              onChange={(value) => handleToggle('mentorshipReminders', value)}
              label="Mentorship Reminders"
              description="Get reminders for scheduled mentorship sessions"
            />
          </div>
        )}
        
        {/* Content Notifications */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Content Notifications</h3>
          
          <Switch
            id="discussionReplies"
            checked={notificationSettings.discussionReplies}
            onChange={(value) => handleToggle('discussionReplies', value)}
            label="Discussion Replies"
            description="Get notified when someone replies to your discussion posts"
          />
          
          <Switch
            id="blogUpdates"
            checked={notificationSettings.blogUpdates}
            onChange={(value) => handleToggle('blogUpdates', value)}
            label="Blog Updates"
            description="Get notified about new blog posts from people you follow"
          />

          <Switch
            id="newPosts"
            checked={notificationSettings.newPosts}
            onChange={(value) => handleToggle('newPosts', value)}
            label="New Posts"
            description="Get notified about new posts in your network"
          />

          <Switch
            id="comments"
            checked={notificationSettings.comments}
            onChange={(value) => handleToggle('comments', value)}
            label="Comments"
            description="Get notified when someone comments on your posts"
          />
        </div>

        {/* System Notifications */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">System Notifications</h3>
          
          <Switch
            id="systemUpdates"
            checked={notificationSettings.systemUpdates}
            onChange={(value) => handleToggle('systemUpdates', value)}
            label="System Updates"
            description="Get notified about platform updates and maintenance"
          />          <Switch
            id="securityAlerts"
            checked={notificationSettings.securityAlerts}
            onChange={(value) => handleToggle('securityAlerts', value)}
            label="Security Alerts"
            description="Get notified about account security events"
          />        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
