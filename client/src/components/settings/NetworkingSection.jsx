import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

// Switch component (reused from other components)
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

const NetworkingSection = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [networkingPreferences, setNetworkingPreferences] = useState({
    openToMentoring: false,
    providingInternships: false,
    attendingSchoolTalks: false,
    availableForCareerAdvice: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  
  // Check if user is mentor
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
  
  // Fetch networking preferences
  useEffect(() => {
    if (user) {
      // For now, use mock data
      const mockPreferences = {
        openToMentoring: user.networkingPreferences?.openToMentoring || false,
        providingInternships: user.networkingPreferences?.providingInternships || false,
        attendingSchoolTalks: user.networkingPreferences?.attendingSchoolTalks || false,
        availableForCareerAdvice: user.networkingPreferences?.availableForCareerAdvice || false
      };
      setNetworkingPreferences(mockPreferences);
      setIsMentor(user.isMentor || false);
    }
  }, [user]);
  
  // Handle toggle changes
  const handleToggle = (key, value) => {
    setNetworkingPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
    
    // If toggling mentoring option, also toggle isMentor
    if (key === 'openToMentoring') {
      setIsMentor(value);
    }
  };
  
  // Save networking preferences
  const savePreferences = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, implement API call
      // Mock API call
      setTimeout(() => {
        console.log('Saving networking preferences:', {
          networkingPreferences,
          isMentor
        });
        setMessage({ 
          type: 'success', 
          text: 'Networking preferences saved successfully!' 
        });
        setLoading(false);
        setHasChanges(false);
      }, 1000);
      
      // Actual API implementation would be:
      /*
      const response = await fetch(`${API_URL}/api/users/settings/networking`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ 
          networkingPreferences,
          isMentor 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save networking preferences');
      }
      
      setMessage({ type: 'success', text: 'Networking preferences saved successfully!' });
      setHasChanges(false);
      */
    } catch (error) {
      console.error('Error saving networking preferences:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save networking preferences' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Networking Preferences Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Networking Preferences</CardTitle>
              <CardDescription>
                Set your availability for helping current students and fellow alumni
              </CardDescription>
            </div>
            {hasChanges && (
              <Button 
                onClick={savePreferences} 
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
            <Switch
              id="openToMentoring"
              checked={networkingPreferences.openToMentoring}
              onChange={(value) => handleToggle('openToMentoring', value)}
              label="Open to Mentoring"
              description="Make yourself available as a mentor to students and junior alumni"
            />
            
            <Switch
              id="providingInternships"
              checked={networkingPreferences.providingInternships}
              onChange={(value) => handleToggle('providingInternships', value)}
              label="Providing Internships"
              description="Indicate if you or your company can provide internship opportunities"
            />
            
            <Switch
              id="attendingSchoolTalks"
              checked={networkingPreferences.attendingSchoolTalks}
              onChange={(value) => handleToggle('attendingSchoolTalks', value)}
              label="Available for School Talks"
              description="Willing to participate in career day, guest lectures, or other school events"
            />
            
            <Switch
              id="availableForCareerAdvice"
              checked={networkingPreferences.availableForCareerAdvice}
              onChange={(value) => handleToggle('availableForCareerAdvice', value)}
              label="Available for Career Advice"
              description="Open to providing career guidance and advice to students and fellow alumni"
            />
          </div>
          
          {/* Mentor Badge Information */}
          <div className={`mt-6 p-4 rounded-md ${
            isMentor ? 'bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900' : 
                       'bg-muted/30'
          }`}>
            <h3 className="text-sm font-medium mb-2">
              {isMentor ? 'You are a Mentor 🎓' : 'Become a Mentor'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isMentor 
                ? 'Thank you for volunteering as a mentor! Your profile now displays a mentor badge, and you will be listed in the mentorship directory.' 
                : 'Becoming a mentor allows you to give back to the community by helping current students and junior alumni. Enable the "Open to Mentoring" option above to become a mentor.'}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Mentoring Resources Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mentoring Resources</CardTitle>
          <CardDescription>
            Helpful information to enhance your mentoring experience
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/resources/mentoring-guide" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Mentoring Guide</h3>
              <p className="text-xs text-muted-foreground">
                Best practices and tips for effective mentoring
              </p>
            </a>
            
            <a 
              href="/resources/mentorship-faq" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Mentorship FAQ</h3>
              <p className="text-xs text-muted-foreground">
                Common questions about the mentorship program
              </p>
            </a>
            
            <a 
              href="/resources/mentor-training" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Mentor Training</h3>
              <p className="text-xs text-muted-foreground">
                Access our mentor training materials and videos
              </p>
            </a>
            
            <a 
              href="/resources/success-stories" 
              className="block p-4 border rounded-md hover:bg-accent transition-colors"
            >
              <h3 className="text-sm font-semibold mb-1">Success Stories</h3>
              <p className="text-xs text-muted-foreground">
                Read about successful mentorship relationships
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingSection;
