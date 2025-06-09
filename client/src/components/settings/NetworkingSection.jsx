import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '@/contexts/auth';

// Modal Dialog Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mentor Profile Setup
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete your profile to start mentoring students
            </p>
          </div>          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

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
  
  // Modal and form states
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorProfile, setMentorProfile] = useState({
    expertise: '',
    yearsOfExperience: '',
    industry: '',
    currentPosition: '',
    company: '',
    mentoringAreas: '',
    availability: '',
    preferredMeetingType: 'video',
    maxMentees: '',
    bio: ''
  });
  
  // Check if user is mentor
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
    // Fetch networking preferences
  useEffect(() => {
    const fetchNetworkingPreferences = async () => {
      try {
        // Import the settings service
        const { getUserProfile } = await import('@/services/settingsService');
        
        // Call the API to get user profile with networking preferences
        const response = await getUserProfile();
        
        if (response.success) {
          const userData = response.data.user;
          
          if (userData.networkingPreferences) {
            const userPreferences = userData.networkingPreferences;
            
            setNetworkingPreferences({
              openToMentoring: userPreferences.openToMentoring || false,
              providingInternships: userPreferences.providingInternships || false,
              attendingSchoolTalks: userPreferences.attendingSchoolTalks || false,
              availableForCareerAdvice: userPreferences.availableForCareerAdvice || false
            });
          }
          
          // Set mentor status
          if (userData.isMentor !== undefined) {
            setIsMentor(userData.isMentor);
          } else {
            setIsMentor(user.isMentor || false);
          }
        } else {
          // If API call fails, fall back to user context
          const fallbackPreferences = {
            openToMentoring: user.networkingPreferences?.openToMentoring || false,
            providingInternships: user.networkingPreferences?.providingInternships || false,
            attendingSchoolTalks: user.networkingPreferences?.attendingSchoolTalks || false,
            availableForCareerAdvice: user.networkingPreferences?.availableForCareerAdvice || false
          };
          setNetworkingPreferences(fallbackPreferences);
          setIsMentor(user.isMentor || false);
        }
      } catch (error) {
        console.error('Error fetching networking preferences:', error);
        // Fall back to user context
        const fallbackPreferences = {
          openToMentoring: user.networkingPreferences?.openToMentoring || false,
          providingInternships: user.networkingPreferences?.providingInternships || false,
          attendingSchoolTalks: user.networkingPreferences?.attendingSchoolTalks || false,
          availableForCareerAdvice: user.networkingPreferences?.availableForCareerAdvice || false
        };
        setNetworkingPreferences(fallbackPreferences);
        setIsMentor(user.isMentor || false);
      }
    };
    
    if (user && user.role === 'alumni') {
      fetchNetworkingPreferences();
    }
  }, [user]);
    // Handle toggle changes
  const handleToggle = (key, value) => {
    // If toggling on "Open to Mentoring" and user is not already a mentor, show modal
    if (key === 'openToMentoring' && value && !isMentor) {
      setShowMentorModal(true);
      return;
    }
    
    // If toggling off "Open to Mentoring", turn off mentor status
    if (key === 'openToMentoring' && !value) {
      setIsMentor(false);
    }
    
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
    // Handle mentor form submission
  const handleMentorFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Import the settings service for saving mentor profile
      const { saveMentorProfile } = await import('@/services/settingsService');
      
      // Save mentor profile data
      const response = await saveMentorProfile(mentorProfile);
      
      if (response.success) {
        // Set the preferences with mentoring enabled
        setNetworkingPreferences(prev => ({
          ...prev,
          openToMentoring: true
        }));
        setIsMentor(true);
        setHasChanges(true);
        setShowMentorModal(false);
        
        setMessage({ 
          type: 'success', 
          text: 'Mentor profile created successfully! Don\'t forget to save your changes.' 
        });
      } else {
        throw new Error(response.error || 'Failed to save mentor profile');
      }
    } catch (error) {
      console.error('Error saving mentor profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create mentor profile' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle mentor form input changes
  const handleMentorFormChange = (field, value) => {
    setMentorProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setShowMentorModal(false);
    // Reset mentor profile form
    setMentorProfile({
      expertise: '',
      yearsOfExperience: '',
      industry: '',
      currentPosition: '',
      company: '',
      mentoringAreas: '',
      availability: '',
      preferredMeetingType: 'video',
      maxMentees: '',
      bio: ''
    });
  };
    // Save networking preferences
  const savePreferences = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Import settings service
      const { updateNetworkingPreferences } = await import('@/services/settingsService');
      
      // We also need to update the isMentor status, but for now we'll include it in networkingPreferences
      // A more robust solution would be to add a separate API endpoint for updating mentor status
      const preferencesWithMentor = {
        ...networkingPreferences,
        isMentor // Include the mentor status
      };
      
      // Call the API service to update networking preferences
      const response = await updateNetworkingPreferences(preferencesWithMentor);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Networking preferences saved successfully!' 
        });
        setHasChanges(false);
      } else {
        throw new Error(response.error || 'Failed to save networking preferences');
      }
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
            </a>          </div>
        </CardContent>
      </Card>
        {/* Mentor Profile Modal */}
      <Modal isOpen={showMentorModal} onClose={handleModalClose}>
        <form onSubmit={handleMentorFormSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Areas of Expertise *
                </label>
                <Input
                  id="expertise"
                  value={mentorProfile.expertise}
                  onChange={(e) => handleMentorFormChange('expertise', e.target.value)}
                  placeholder="e.g., Software Development, Marketing"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={mentorProfile.yearsOfExperience}
                  onChange={(e) => handleMentorFormChange('yearsOfExperience', e.target.value)}
                  placeholder="5"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry *
                </label>
                <Input
                  id="industry"
                  value={mentorProfile.industry}
                  onChange={(e) => handleMentorFormChange('industry', e.target.value)}
                  placeholder="e.g., Technology, Healthcare"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="currentPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Position *
                </label>
                <Input
                  id="currentPosition"
                  value={mentorProfile.currentPosition}
                  onChange={(e) => handleMentorFormChange('currentPosition', e.target.value)}
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <Input
                id="company"
                value={mentorProfile.company}
                onChange={(e) => handleMentorFormChange('company', e.target.value)}
                placeholder="e.g., Tech Corp"
                required
              />
            </div>
          </div>

          {/* Mentoring Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Mentoring Details
            </h3>
            
            <div>
              <label htmlFor="mentoringAreas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mentoring Areas *
              </label>
              <Input
                id="mentoringAreas"
                value={mentorProfile.mentoringAreas}
                onChange={(e) => handleMentorFormChange('mentoringAreas', e.target.value)}
                placeholder="e.g., Career guidance, Technical skills, Interview preparation"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability *
                </label>
                <Input
                  id="availability"
                  value={mentorProfile.availability}
                  onChange={(e) => handleMentorFormChange('availability', e.target.value)}
                  placeholder="e.g., Weekends, Evenings"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maxMentees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Mentees *
                </label>
                <Input
                  id="maxMentees"
                  type="number"
                  value={mentorProfile.maxMentees}
                  onChange={(e) => handleMentorFormChange('maxMentees', e.target.value)}
                  placeholder="3"
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="preferredMeetingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Meeting Type *
              </label>
              <select
                id="preferredMeetingType"
                value={mentorProfile.preferredMeetingType}
                onChange={(e) => handleMentorFormChange('preferredMeetingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="inPerson">In Person</option>
                <option value="email">Email</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
              <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio *
              </label>
              <Textarea
                id="bio"
                value={mentorProfile.bio}
                onChange={(e) => handleMentorFormChange('bio', e.target.value)}
                placeholder="Tell students about yourself, your experience, and how you can help them grow professionally..."
                rows={4}
                className="resize-vertical"
                required
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >              {loading ? (
                <div className="flex items-center justify-center">
                  <Icon name="loader" size={16} className="-ml-1 mr-2 text-white" />
                  Creating Profile...
                </div>
              ) : (
                'Become a Mentor'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NetworkingSection;
