import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

// Switch component since it's not already in the UI components
const Switch = React.forwardRef(({ id, checked, onChange, label, description, ...props }, ref) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <label 
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-primary' : 'bg-input'
        }`}
        {...props}
      >
        <span 
          data-state={checked ? "checked" : "unchecked"}
          className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});
Switch.displayName = "Switch";

const NotificationsSection = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    eventReminders: true,
    mentorshipUpdates: false,
    discussionReplies: false,
    blogUpdates: false,
    weeklyNewsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fetch notification settings
  useEffect(() => {
    if (user) {
      // In a real app, fetch from API
      // const fetchNotificationSettings = async () => {
      //   const response = await fetch(`${API_URL}/api/users/settings/notifications`, {
      //     headers: { 'x-auth-token': localStorage.getItem('token') }
      //   });
      //   const data = await response.json();
      //   setNotificationSettings(data.notificationSettings);
      // };
      // fetchNotificationSettings();
      
      // For now, use mock data
      const mockSettings = {
        pushNotifications: user.notificationSettings?.pushNotifications ?? true,
        emailNotifications: user.notificationSettings?.emailNotifications ?? true,
        eventReminders: user.notificationSettings?.eventReminders ?? true,
        mentorshipUpdates: user.notificationSettings?.mentorshipUpdates ?? false,
        discussionReplies: user.notificationSettings?.discussionReplies ?? false,
        blogUpdates: user.notificationSettings?.blogUpdates ?? false,
        weeklyNewsletter: user.notificationSettings?.weeklyNewsletter ?? false
      };
      setNotificationSettings(mockSettings);
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
      // In a real app, implement API call
      // Mock API call
      setTimeout(() => {
        console.log('Saving notification settings:', notificationSettings);
        setMessage({ 
          type: 'success', 
          text: 'Notification settings saved successfully!' 
        });
        setLoading(false);
        setHasChanges(false);
      }, 1000);
      
      // Actual API implementation would be:
      /*
      const response = await fetch(`${API_URL}/api/users/settings/notifications`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ notificationSettings })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save notification settings');
      }
      
      setMessage({ type: 'success', text: 'Notification settings saved successfully!' });
      setHasChanges(false);
      */
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
          {hasChanges && (
            <Button 
              onClick={saveSettings} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
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
        </div>
        
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Event Notifications</h3>
          
          <Switch
            id="eventReminders"
            checked={notificationSettings.eventReminders}
            onChange={(value) => handleToggle('eventReminders', value)}
            label="Event Reminders"
            description="Get reminders for upcoming events you've registered for"
          />
        </div>
        
        {user?.role === 'alumni' && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Mentorship Notifications</h3>
            
            <Switch
              id="mentorshipUpdates"
              checked={notificationSettings.mentorshipUpdates}
              onChange={(value) => handleToggle('mentorshipUpdates', value)}
              label="Mentorship Updates"
              description="Receive updates on mentorship requests and sessions"
            />
          </div>
        )}
        
        <div className="mt-6 space-y-2">
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
            id="weeklyNewsletter"
            checked={notificationSettings.weeklyNewsletter}
            onChange={(value) => handleToggle('weeklyNewsletter', value)}
            label="Weekly Newsletter"
            description="Receive weekly digest of activities and updates"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
