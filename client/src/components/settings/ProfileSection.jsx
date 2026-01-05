import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { compressImageToBase64, validateImageFile, createImagePreview, cleanupImagePreview } from '@/utils/imageUtils';

const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
    profilePicture: '',
    socialLinks: {
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: '',
      github: '',
    },
    // Role-specific fields
    batch: '',
    parentGuardianContact: '',
    currentOccupation: '',
    subjectsTaught: []
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Fetch user profile data (local only - backend removed)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Use user context data directly (backend removed)
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          bio: user.bio || '',
          profilePicture: user.profilePicture || '',
          socialLinks: user.socialLinks || {
            linkedin: '',
            instagram: '',
            twitter: '',
            facebook: '',
            github: '',
          },
          batch: user.batch || '',
          parentGuardianContact: user.parentGuardianContact || '',
          currentOccupation: user.currentOccupation || '',
          subjectsTaught: user.subjectsTaught || []
        });
        
        if (user.profilePicture) {
          setImagePreview(user.profilePicture);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    
    if (user) {
      fetchProfileData();
    }
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields like socialLinks.linkedin
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle subjects taught (multi-select for teachers)
  const handleSubjectsChange = (e) => {
    const value = e.target.value;
    // Split by comma and trim
    const subjects = value.split(',').map(subject => subject.trim());
    setProfileData(prev => ({
      ...prev,
      subjectsTaught: subjects
    }));
  };  // Handle profile image upload with compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setMessage({
          type: 'error',
          text: validation.error
        });
        setLoading(false);
        return;
      }
      
      // Show loading message
      setMessage({
        type: 'info',
        text: 'Compressing image...'
      });
      
      // Compress and convert to base64
      const compressedBase64 = await compressImageToBase64(file, 400, 400, 0.8);
      
      // Update image preview
      setImagePreview(compressedBase64);
      
      // Update profile data with compressed base64 string
      setProfileData(prev => ({
        ...prev,
        profilePicture: compressedBase64
      }));
      
      // Clear messages
      setMessage({ type: '', text: '' });
      
    } catch (error) {
      console.error('Error processing image:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Error processing the image. Please try a smaller image.'
      });
    } finally {
      setLoading(false);
    }
  };  // Auto-save functionality (stub - backend removed)
  const debouncedSave = useDebouncedCallback(async (data) => {
    // Backend removed - no auto-save
    console.log('Auto-save disabled - backend removed');
  }, 2000);
  
  // Effect to trigger auto-save when profileData changes and in edit mode
  useEffect(() => {
    if (isEditing) {
      debouncedSave(profileData);
    }
  }, [profileData, isEditing, debouncedSave]);  // Save profile changes (local only - backend removed)
  const saveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Update local user context only (backend removed)
      updateUser({
        name: profileData.name,
        profilePicture: profileData.profilePicture,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
        socialLinks: profileData.socialLinks,
        batch: profileData.batch,
        parentGuardianContact: profileData.parentGuardianContact,
        currentOccupation: profileData.currentOccupation,
        subjectsTaught: profileData.subjectsTaught
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated locally (backend removed)!' 
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile';
      
      // Handle specific error types
      if (error.message.includes('Authentication failed') || error.message.includes('Token is not valid')) {
        errorMessage = 'Your session has expired. Please refresh the page and login again.';
        // Optionally redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (error.message.includes('No authentication token found')) {
        errorMessage = 'Authentication required. Please login again.';
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.message.includes('413') || error.message.includes('Payload Too Large')) {
        errorMessage = 'Profile picture is too large. Please try a smaller image.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid profile data. Please check your inputs.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Character counter for bio
  const bioMaxLength = 250;
  const bioCharsLeft = bioMaxLength - (profileData.bio?.length || 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the platform
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
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
        
        <form className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt={profileData.name} />
              ) : (
                <AvatarFallback>
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            {isEditing && (
              <div>
                <label className="block mb-2 text-sm font-medium">Profile Picture</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={!isEditing}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, at least 300x300px
                </p>
              </div>
            )}
          </div>
          
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email Address</label>
              <Input
                name="email"
                value={profileData.email}
                disabled={true} // Email should be changed through a separate email verification flow
                placeholder="Your email address"
              />
              {isEditing && (
                <p className="text-xs text-gray-500">
                  Email changes require verification. Contact support to update.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Address</label>
              <Input
                name="address"
                value={profileData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your address"
              />
            </div>
          </div>
          
          {/* Role-specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.role === 'student' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Batch/Year</label>
                  <Input
                    name="batch"
                    value={profileData.batch}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your batch/graduation year"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Parent/Guardian Contact</label>
                  <Input
                    name="parentGuardianContact"
                    value={profileData.parentGuardianContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Parent or guardian contact number"
                  />
                </div>
              </>
            )}
            
            {user?.role === 'alumni' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Batch/Year</label>
                  <Input
                    name="batch"
                    value={profileData.batch}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your batch/graduation year"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Current Occupation</label>
                  <Input
                    name="currentOccupation"
                    value={profileData.currentOccupation}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Your current job/role"
                  />
                </div>
              </>
            )}
            
            {user?.role === 'teacher' && (
              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium">Subjects Taught</label>
                <Input
                  name="subjectsTaught"
                  value={profileData.subjectsTaught?.join(', ')}
                  onChange={handleSubjectsChange}
                  disabled={!isEditing}
                  placeholder="Enter subjects separated by commas"
                />
              </div>
            )}
          </div>
          
          {/* Bio with character count */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium">Bio</label>
              <span className={`text-xs ${bioCharsLeft < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                {bioCharsLeft} characters left
              </span>
            </div>
            <Textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              maxLength={bioMaxLength}
              rows={4}
            />
          </div>
          
          {/* Social Links */}
          <div>
            <h4 className="text-sm font-medium mb-2">Social Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">LinkedIn</label>
                <Input
                  name="socialLinks.linkedin"
                  value={profileData.socialLinks?.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="LinkedIn profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Instagram</label>
                <Input
                  name="socialLinks.instagram"
                  value={profileData.socialLinks?.instagram}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Instagram profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Twitter</label>
                <Input
                  name="socialLinks.twitter"
                  value={profileData.socialLinks?.twitter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Twitter profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Facebook</label>
                <Input
                  name="socialLinks.facebook"
                  value={profileData.socialLinks?.facebook}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Facebook profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">GitHub</label>
                <Input
                  name="socialLinks.github"
                  value={profileData.socialLinks?.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="GitHub profile URL"
                />
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={saveProfile} 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
