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
  const { user, updateUser, syncUserFromServer } = useAuth();
    const [networkingPreferences, setNetworkingPreferences] = useState({
    openToMentoring: false,
    providingInternships: false,
    attendingSchoolTalks: false,
    availableForCareerAdvice: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
    // Modal and form states
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorProfile, setMentorProfile] = useState({
    // Basic Info
    fullName: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    socialLinks: {
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      github: user?.socialLinks?.github || '',
      facebook: user?.socialLinks?.facebook || '',      instagram: user?.socialLinks?.instagram || ''
    },
    // Professional Details
    currentOccupation: user?.currentOccupation || '',
    company: '',
    yearsOfExperience: '',
    // Mentoring Details
    mentoringAreas: [],
    customMentoringAreas: [],
    bio: ''
  });
    // Check if user is mentor
  const [isMentor, setIsMentor] = useState(user?.isMentor || false);
  
  // Track if user has existing mentor profile
  const [hasMentorProfile, setHasMentorProfile] = useState(false);  // Initialize preferences from user context first, then optionally sync with server
  useEffect(() => {
    if (user && user.role === 'alumni') {
      // First, immediately set preferences from user context (from login data)
      const mentorStatus = user.isMentor || false;
      setIsMentor(mentorStatus);
      
      if (user.networkingPreferences) {
        setNetworkingPreferences({
          // If user is a mentor, openToMentoring should always be true
          openToMentoring: mentorStatus ? true : (user.networkingPreferences.openToMentoring || false),
          providingInternships: user.networkingPreferences.providingInternships || false,
          attendingSchoolTalks: user.networkingPreferences.attendingSchoolTalks || false,
          availableForCareerAdvice: user.networkingPreferences.availableForCareerAdvice || false
        });
      } else {
        // If no networking preferences exist in context, set defaults based on mentor status
        setNetworkingPreferences({
          openToMentoring: mentorStatus,
          providingInternships: false,
          attendingSchoolTalks: false,
          availableForCareerAdvice: false
        });
      }
      
      // Fetch available subjects
      fetchAvailableSubjects();
      
      // Always check for mentor profile
      fetchMentorProfile();
    }
  }, [user]);

  // Backend sync removed
  const syncWithServer = async () => {
    // Backend removed
    console.log('Backend removed - no server sync');
  };
  
  // Fetch available subjects (backend removed)
  const fetchAvailableSubjects = async () => {
    // Backend removed - no subjects to fetch
    setAvailableSubjects([]);
  };
  
  // Fetch existing mentor profile (backend removed)
  const fetchMentorProfile = async () => {
    // Backend removed
    setHasMentorProfile(false);
  };
  
  // Handle toggle changes
  const handleToggle = (key, value) => {
    // If toggling on "Open to Mentoring"
    if (key === 'openToMentoring' && value) {
      // If user doesn't have a mentor profile yet, show modal to create one
      if (!hasMentorProfile) {
        setShowMentorModal(true);
        return;
      }
      // If user has mentor profile, allow direct toggle
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
      // Backend removed
      const response = { success: false };
      
      if (response.success) {
        // Update local state first
        setNetworkingPreferences(prev => ({
          ...prev,
          openToMentoring: true
        }));
        setIsMentor(true);
        setHasMentorProfile(true); // User now has a mentor profile
        setHasChanges(true);
        setShowMentorModal(false);
        
        // Update user context to reflect mentor status and networking preferences
        const updatedUserData = {
          isMentor: true,
          networkingPreferences: {
            ...networkingPreferences,
            openToMentoring: true
          }
        };
        updateUser(updatedUserData);
        
        // Sync from server to ensure we have the latest data
        await syncUserFromServer();
        
        // Determine if custom subjects were added
        const hasCustomSubjects = profileToSave.customMentoringAreas && 
                                 profileToSave.customMentoringAreas.filter(area => area.trim() !== '').length > 0;
        
        setMessage({ 
          type: 'success', 
          text: hasCustomSubjects 
            ? 'Mentor profile created successfully! Your custom subjects have been added to the database and will be available for others to select. You can now access the Mentorship section.' 
            : 'Mentor profile created successfully! You can now access the Mentorship section.'
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
    if (field.startsWith('socialLinks.')) {
      const socialField = field.split('.')[1];
      setMentorProfile(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));    } else if (field === 'mentoringAreas') {
      // Handle multi-select for mentoring areas
      setMentorProfile(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (field === 'customMentoringAreas') {
      // Handle array of custom mentoring areas
      setMentorProfile(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setMentorProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }  };
  
  // Handle modal close
  const handleModalClose = () => {
    setShowMentorModal(false);
    
    // Reset the "Open to Mentoring" toggle if user cancels mentor profile creation
    // Only reset if user doesn't have an existing mentor profile
    if (!hasMentorProfile) {
      setNetworkingPreferences(prev => ({
        ...prev,
        openToMentoring: false
      }));
      setIsMentor(false);
    }
    
    // Reset mentor profile form
    setMentorProfile({
      // Basic Info
      fullName: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phone || '',
      socialLinks: {
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || '',
        github: user?.socialLinks?.github || '',
        facebook: user?.socialLinks?.facebook || '',
        instagram: user?.socialLinks?.instagram || ''
      },
      // Professional Details      currentOccupation: user?.currentOccupation || '',
      company: '',
      yearsOfExperience: '',
      // Mentoring Details
      mentoringAreas: [],
      customMentoringAreas: [],
      bio: ''
    });
  };
  // Save networking preferences
  const savePreferences = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Backend removed
      const response = { success: false };
      
      if (response.success) {
        // Update the user context with the new networking preferences and mentor status
        const updatedUserData = {
          networkingPreferences: networkingPreferences,
          isMentor: isMentor
        };
        updateUser(updatedUserData);
        
        setMessage({ 
          type: 'success', 
          text: 'Networking preferences saved successfully!' 
        });
        setHasChanges(false);
      } else {
        throw new Error('Backend removed - preferences not saved');
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
          
          <div className="space-y-2">            <Switch
              id="openToMentoring"
              checked={networkingPreferences.openToMentoring}
              onChange={(value) => handleToggle('openToMentoring', value)}
              label="Open to Mentoring"
              description="Make yourself available as a mentor to current high school students"
            />
            
            <Switch
              id="providingInternships"
              checked={networkingPreferences.providingInternships}
              onChange={(value) => handleToggle('providingInternships', value)}
              label="Providing Internships/Job Shadowing"
              description="Indicate if you or your organization can provide internship or job shadowing opportunities"
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
              description="Open to providing college and career guidance to high school students"
            />
          </div>
          
          {/* Mentor Badge Information */}
          <div className={`mt-6 p-4 rounded-md ${
            isMentor ? 'bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900' : 
                       'bg-muted/30'
          }`}>
            <h3 className="text-sm font-medium mb-2">
              {isMentor ? 'You are a Mentor 🎓' : 'Become a Mentor'}
            </h3>            <p className="text-sm text-muted-foreground">
              {isMentor 
                ? 'Thank you for volunteering as a mentor! Your profile now displays a mentor badge, and you will be listed in the mentorship directory to help current high school students.' 
                : 'Becoming a mentor allows you to give back by helping current high school students navigate their academic journey and prepare for college. Enable the "Open to Mentoring" option above to become a mentor.'}
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
      <Modal isOpen={showMentorModal} onClose={handleModalClose}>        <form onSubmit={handleMentorFormSubmit} className="space-y-6">
          {/* Basic Information Section */}          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h3>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <Input
                id="fullName"
                value={mentorProfile.fullName}
                onChange={(e) => handleMentorFormChange('fullName', e.target.value)}
                placeholder="Your full name"
                required
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">This information is fetched from your profile</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={mentorProfile.email}
                onChange={(e) => handleMentorFormChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">This information is fetched from your backend profile</p>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={mentorProfile.phoneNumber}
                onChange={(e) => handleMentorFormChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">This information is fetched from your backend profile if available</p>
            </div>

            {/* Social Links - Optional */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Social Links (Optional)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="linkedin" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    LinkedIn
                  </label>
                  <Input
                    id="linkedin"
                    value={mentorProfile.socialLinks.linkedin}
                    onChange={(e) => handleMentorFormChange('socialLinks.linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Twitter
                  </label>
                  <Input
                    id="twitter"
                    value={mentorProfile.socialLinks.twitter}
                    onChange={(e) => handleMentorFormChange('socialLinks.twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label htmlFor="github" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    GitHub
                  </label>
                  <Input
                    id="github"
                    value={mentorProfile.socialLinks.github}
                    onChange={(e) => handleMentorFormChange('socialLinks.github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div>
                  <label htmlFor="facebook" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Facebook
                  </label>
                  <Input
                    id="facebook"
                    value={mentorProfile.socialLinks.facebook}
                    onChange={(e) => handleMentorFormChange('socialLinks.facebook', e.target.value)}
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Instagram
                  </label>
                  <Input
                    id="instagram"
                    value={mentorProfile.socialLinks.instagram}
                    onChange={(e) => handleMentorFormChange('socialLinks.instagram', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
              </div>
            </div>
          </div>          {/* Professional Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Professional Details
            </h3>
              <div>
              <label htmlFor="currentOccupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Occupation/Role *
              </label>
              <Input
                id="currentOccupation"
                value={mentorProfile.currentOccupation}
                onChange={(e) => handleMentorFormChange('currentOccupation', e.target.value)}
                placeholder="e.g., College Student, Software Engineer, Teacher, Business Owner"
                required
              />
            </div>
              <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company / Organization / Institution *
              </label>
              <Input
                id="company"
                value={mentorProfile.company}
                onChange={(e) => handleMentorFormChange('company', e.target.value)}
                placeholder="e.g., Harvard University, Google, Local High School, Self-Employed"
                required
              />
            </div>
            
            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years Since High School Graduation *
              </label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={mentorProfile.yearsOfExperience}
                onChange={(e) => handleMentorFormChange('yearsOfExperience', e.target.value)}
                placeholder="e.g., 2"
                min="0"
                max="50"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the number of years since you graduated from high school</p>
            </div>
          </div>          {/* Mentoring Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Mentoring Details
            </h3>
              <div>              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Subjects You Can Mentor *
              </label>
              <p className="text-xs text-gray-500 mb-3">Choose subjects where you excel and can help high school students. Custom subjects you add will be available for other mentors to select.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
                {/* Show loading indicator if subjects are still being fetched */}
                {availableSubjects.length === 0 ? (
                  <div className="col-span-2 flex justify-center items-center py-4">
                    <Icon name="loader" size={20} className="animate-spin mr-2" />
                    <span>Loading subjects...</span>
                  </div>
                ) : (
                  /* Map through subjects from the database */
                  [...availableSubjects.map(subject => ({
                    value: subject._id,
                    label: subject.name
                  })), 
                  /* Always add "Other" option */
                  { value: 'other', label: 'Other (Specify below)' }
                ].map((area) => (
                  <label key={area.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 p-1 rounded">
                    <input
                      type="checkbox"
                      value={area.value}
                      checked={mentorProfile.mentoringAreas.includes(area.value)}                      onChange={(e) => {
                        const value = e.target.value;
                        const isChecked = e.target.checked;
                        let updatedAreas;
                        
                        if (isChecked) {
                          updatedAreas = [...mentorProfile.mentoringAreas, value];
                          
                          // Auto-initialize: When "other" is first selected, add empty custom area
                          if (value === 'other' && mentorProfile.customMentoringAreas.length === 0) {
                            handleMentorFormChange('customMentoringAreas', ['']);
                          }
                        } else {
                          updatedAreas = mentorProfile.mentoringAreas.filter(area => area !== value);
                          
                          // If unchecking "other", also clear the custom areas
                          if (value === 'other') {
                            handleMentorFormChange('customMentoringAreas', []);
                          }
                        }
                        
                        handleMentorFormChange('mentoringAreas', updatedAreas);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{area.label}</span>
                  </label>
                )))}
              </div>
                {/* Show custom areas input if "other" is selected */}
              {mentorProfile.mentoringAreas.includes('other') && (
                <div className="mt-3 space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Please specify your other mentoring subjects:
                  </label>
                  
                  {/* Display existing custom areas */}
                  {mentorProfile.customMentoringAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={area}
                        onChange={(e) => {
                          const updatedAreas = [...mentorProfile.customMentoringAreas];
                          updatedAreas[index] = e.target.value;
                          handleMentorFormChange('customMentoringAreas', updatedAreas);
                        }}
                        placeholder="e.g., Rigzhung, Statistics, Philosophy"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedAreas = mentorProfile.customMentoringAreas.filter((_, i) => i !== index);
                          handleMentorFormChange('customMentoringAreas', updatedAreas);
                        }}
                        className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Icon name="x" size={16} />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add new custom area button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedAreas = [...mentorProfile.customMentoringAreas, ''];
                      handleMentorFormChange('customMentoringAreas', updatedAreas);
                    }}
                    className="w-full py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-dashed"
                  >
                    <Icon name="plus" size={16} className="mr-2" />
                    Add Another Subject
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    You can add multiple subjects that aren't listed above. Each subject should be specific (e.g., "Advanced Calculus" rather than just "Math"). 
                    Your custom subjects will be added to the database and available for other mentors to select.
                  </p>
                </div>
              )}
                {mentorProfile.mentoringAreas.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one subject you can mentor.</p>
              )}
            </div>
              <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Bio - Why do you want to become a mentor? *
              </label>
              <Textarea
                id="bio"
                value={mentorProfile.bio}
                onChange={(e) => handleMentorFormChange('bio', e.target.value)}
                placeholder="Share your motivation for becoming a mentor. What drives you to help high school students? What unique perspective or experience from your high school journey can you offer? How do you plan to make a positive impact on current students' academic and personal growth?"
                rows={5}
                className="resize-vertical"
                maxLength={1000}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Tell us about your passion for mentoring high school students and what you hope to achieve (max 1000 characters)</p>
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
