import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { getPrivacySettings, updatePrivacySettings, resetPrivacySettings, updateVisibilityPreference } from '@/services/settingsService';

// Dialog component for confirmation modal
const Dialog = ({
  title,
  description,
  children,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "destructive"
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {children}
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant={confirmVariant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PrivacySection = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
    const [privacySettings, setPrivacySettings] = useState({
    // Profile visibility
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showSocialLinks: true,
    showWorkHistory: true,
    showEducationHistory: true,
    
    // Contact information
    allowDirectMessages: true,
    allowConnections: true,
    
    // Interaction settings
    allowTagging: true,
    allowMentioning: true,
    allowProfileViewing: true,
      // Search and discovery
    searchableByEmail: false,
    searchableByPhone: false,
    appearsInSuggestions: true,
    showInDirectory: true
  });  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // Fetch privacy settings
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        setLoading(true);
          // First check if user has privacySettings in the user object
        if (user && user.privacySettings) {
          console.log('Using privacy settings from user object:', user.privacySettings);
          console.log('Privacy settings profile visibility:', user.privacySettings.profileVisibility);
          console.log('User object structure:', JSON.stringify({
            id: user.id,
            hasPrivacySettings: !!user.privacySettings,
            privacySettingsType: typeof user.privacySettings,
            privacySettingsKeys: user.privacySettings ? Object.keys(user.privacySettings) : []
          }));
          
          // Validate structure of privacy settings
          if (typeof user.privacySettings === 'object' && 
              Object.keys(user.privacySettings).length > 0 && 
              user.privacySettings.profileVisibility) {
            console.log('Privacy settings appear to be valid, using them');
            setPrivacySettings(user.privacySettings);
          } else {
            console.warn('Invalid privacy settings structure in user object, will fetch from API instead');
            console.log('Invalid settings:', user.privacySettings);
            fetchFromAPI();
          }
        } else {
          console.log('User has no privacy settings in user object, fetching from API');
          fetchFromAPI();
        }
        
        // Function to fetch settings from API
        async function fetchFromAPI() {          // Fetch from the API
          const response = await getPrivacySettings();
          
          if (response.success && response.data) {
            console.log('Successfully fetched privacy settings from API:', response.data);
            setPrivacySettings(response.data);
            
            // Make sure we got valid data before updating the user
            if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
              // Update user object with privacy settings
              if (user) {
                console.log('Updating user object with fresh privacy settings from API');
                const updatedUser = { ...user, privacySettings: response.data };
                updateUser(updatedUser);
              }
            } else {
              console.error('API returned success but invalid privacy settings data:', response.data);
            }
          } else {            console.error('Failed to fetch privacy settings:', response.error);
            setMessage({ 
              type: 'error', 
              text: 'Failed to load privacy settings' 
            });
          }
        } // End of fetchFromAPI function
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to load privacy settings' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchPrivacySettings();
    }
  }, [user]);
  
  // Handle toggle changes
  const handleToggle = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,      [key]: value
    }));
    setHasChanges(true);
  };
    // Save privacy settings
  const saveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      console.log('Saving privacy settings to server:', privacySettings);
      const response = await updatePrivacySettings(privacySettings);
      
      if (response.success) {
        console.log('Privacy settings saved successfully on server. Response:', response.data);
        
        // Get the saved settings from response data (ensures we use what was actually saved)
        const savedSettings = response.data;
        
        // Refresh user data from server to ensure settings are synced
        const { refreshUserData } = await import('@/services/settingsService');
        const refreshResponse = await refreshUserData();
        
        if (refreshResponse.success) {
          // Get the updated user data from the response
          const updatedUser = refreshResponse.data.user;
          
          // Make sure the user has the latest privacy settings from server
          if (updatedUser.privacySettings) {
            console.log('Server returned privacy settings:', updatedUser.privacySettings);
          } else {
            console.log('Server did not return privacy settings, using saved settings');
            updatedUser.privacySettings = savedSettings;
          }
              
          // Add debug logging to verify the update
          console.log('Updated user with new privacy settings:', {
            userId: updatedUser.id,
            hasPrivacySettings: !!updatedUser.privacySettings,
            profileVisibility: updatedUser.privacySettings?.profileVisibility
          });
        
          // Update the user context and localStorage
          updateUser(updatedUser);
        } else {
          // If refresh failed, update just the privacy settings in the existing user object
          const updatedUser = { ...user, privacySettings: savedSettings };
          console.log('Using fallback to update privacy settings in user object:', {
            userId: user.id,
            privacySettings: JSON.stringify(savedSettings)
          });
          updateUser(updatedUser);
        }
        
        setMessage({ 
          type: 'success', 
          text: 'Privacy settings saved successfully!' 
        });
        setHasChanges(false);
      } else {
        throw new Error(response.error || 'Failed to save privacy settings');
      }    } catch (error) {
      console.error('Error saving privacy settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save privacy settings' 
      });
    } finally {
      setLoading(false);
    }
  };
  // Reset privacy settings to default
  const resetSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      console.log('Resetting privacy settings to default');
      const response = await resetPrivacySettings();
      
      if (response.success) {
        console.log('Privacy settings reset successfully. New settings:', response.data);
        
        // Get default settings from the response
        const defaultSettings = response.data;
        
        // Update local state with the default settings
        setPrivacySettings(defaultSettings);
        
        // Refresh user data from server after reset
        const { refreshUserData } = await import('@/services/settingsService');
        const refreshResponse = await refreshUserData();
        
        if (refreshResponse.success) {
          // Get the updated user data from the response
          const updatedUser = refreshResponse.data.user;
          
          // Make sure the user has the latest privacy settings
          // If server didn't return privacy settings, use the ones from the reset response
          if (!updatedUser.privacySettings) {
            console.log('Server refresh did not return privacy settings, using reset settings');
            updatedUser.privacySettings = defaultSettings;
          }
          
          // Update the user context and localStorage
          updateUser(updatedUser);
        } else {
          // If refresh failed, update just the privacy settings in the existing user object
          const updatedUser = { ...user, privacySettings: defaultSettings };
          console.log('Using fallback to update privacy settings after reset');
          updateUser(updatedUser);
        }
        
        setMessage({ 
          type: 'success', 
          text: 'Privacy settings reset to default successfully!' 
        });
        setHasChanges(false);
      } else {
        throw new Error(response.error || 'Failed to reset privacy settings');
      }
    } catch (error) {
      console.error('Error resetting privacy settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to reset privacy settings' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    setLoading(true);
    try {
      // Import settings service
      const { toggleAccountStatus } = await import('@/services/settingsService');
      
      // Call the API service to deactivate account
      const response = await toggleAccountStatus('deactivated');
      
      if (response.success) {
        setShowDeactivateDialog(false);
        logout(navigate); // Log the user out after deactivation
      } else {
        throw new Error(response.error || 'Failed to deactivate account');
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to deactivate account' 
      });
      setShowDeactivateDialog(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // In a real app, implement API call to delete account
      // Mock API call
      setTimeout(() => {
        console.log('Deleting account...');
        setShowDeleteDialog(false);
        logout(navigate); // Log the user out after deletion
      }, 1000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to delete account' 
      });
      setShowDeleteDialog(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Privacy Settings Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what information is visible to others on the platform
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
          
          {loading && !hasChanges && (
            <div className="mb-4 p-3 rounded-md bg-blue-50 text-blue-800">
              Loading privacy settings...
            </div>
          )}

          {/* Profile Visibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Profile Visibility</h3>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Profile Visibility</label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={privacySettings.profileVisibility}
                onChange={(e) => handleToggle('profileVisibility', e.target.value)}
              >
                <option value="public">Public - Anyone can view</option>
                <option value="alumni-only">Alumni Only - Only verified alumni</option>
                <option value="connections-only">Connections Only - Only your connections</option>
                <option value="private">Private - Only you can view</option>
              </select>
            </div>
            
            <Switch
              id="showEmail"
              checked={privacySettings.showEmail}
              onChange={(value) => handleToggle('showEmail', value)}
              label="Show Email Address"
              description="Display your email address on your public profile"
            />
            
            <Switch
              id="showPhone"
              checked={privacySettings.showPhone}
              onChange={(value) => handleToggle('showPhone', value)}
              label="Show Phone Number"
              description="Display your phone number on your public profile"
            />
            
            <Switch
              id="showSocialLinks"
              checked={privacySettings.showSocialLinks}
              onChange={(value) => handleToggle('showSocialLinks', value)}
              label="Show Social Media Links"
              description="Display your social media profiles on your public profile"
            />
            
            <Switch
              id="showWorkHistory"
              checked={privacySettings.showWorkHistory}
              onChange={(value) => handleToggle('showWorkHistory', value)}
              label="Show Work History"
              description="Display your work experience on your profile"
            />

            <Switch
              id="showEducationHistory"
              checked={privacySettings.showEducationHistory}
              onChange={(value) => handleToggle('showEducationHistory', value)}
              label="Show Education History"
              description="Display your educational background on your profile"
            />
          </div>
          
          {/* Contact & Connection Settings */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Contact & Connections</h3>
            
            <Switch
              id="allowDirectMessages"
              checked={privacySettings.allowDirectMessages}
              onChange={(value) => handleToggle('allowDirectMessages', value)}
              label="Allow Direct Messages"
              description="Allow other users to send you direct messages"
            />

            <Switch
              id="allowConnections"
              checked={privacySettings.allowConnections}
              onChange={(value) => handleToggle('allowConnections', value)}
              label="Allow Connection Requests"
              description="Allow other users to send you connection requests"
            />
          </div>

          {/* Interaction Settings */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Interaction Settings</h3>
            
            <Switch
              id="allowTagging"
              checked={privacySettings.allowTagging}
              onChange={(value) => handleToggle('allowTagging', value)}
              label="Allow Tagging"
              description="Allow other users to tag you in posts and comments"
            />
            
            <Switch
              id="allowMentioning"
              checked={privacySettings.allowMentioning}
              onChange={(value) => handleToggle('allowMentioning', value)}
              label="Allow Mentioning"
              description="Allow other users to mention you in posts and comments"
            />

            <Switch
              id="allowProfileViewing"
              checked={privacySettings.allowProfileViewing}
              onChange={(value) => handleToggle('allowProfileViewing', value)}
              label="Allow Profile Viewing Notifications"
              description="Get notified when someone views your profile"
            />
          </div>

          {/* Search & Discovery */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Search & Discovery</h3>
            
            <Switch
              id="searchableByEmail"
              checked={privacySettings.searchableByEmail}
              onChange={(value) => handleToggle('searchableByEmail', value)}
              label="Searchable by Email"
              description="Allow others to find you by searching your email address"
            />

            <Switch
              id="searchableByPhone"
              checked={privacySettings.searchableByPhone}
              onChange={(value) => handleToggle('searchableByPhone', value)}
              label="Searchable by Phone"
              description="Allow others to find you by searching your phone number"
            />

            <Switch
              id="appearsInSuggestions"
              checked={privacySettings.appearsInSuggestions}
              onChange={(value) => handleToggle('appearsInSuggestions', value)}
              label="Appear in Suggestions"
              description="Allow your profile to appear in connection suggestions"
            />

            <Switch
              id="showInDirectory"
              checked={privacySettings.showInDirectory}
              onChange={(value) => handleToggle('showInDirectory', value)}
              label="Show in Alumni Directory"
              description="Include your profile in the public alumni directory"            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            disabled={loading}
          >
            Reset to Default
          </Button>
          
          {hasChanges && (
            <Button 
              onClick={saveSettings} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Account Management Card */}
      <Card className="w-full bg-muted/30">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Options for managing your account access and data
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Deactivate Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Temporarily suspend your account. You can reactivate anytime by logging back in.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowDeactivateDialog(true)}
              >
                Deactivate Account
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-red-500 mb-2">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialogs */}
      <Dialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={handleDeactivateAccount}
        title="Deactivate Account"
        description="Are you sure you want to deactivate your account? Your profile will be hidden from other users until you log back in."
        confirmText="Deactivate"
        confirmVariant="secondary"
      />
      
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? All your data will be erased and this action cannot be undone."
        confirmText="Delete Account"
        confirmVariant="destructive"
      >
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 rounded-md">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            This will permanently delete:
          </p>
          <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200 mt-1">
            <li>Your profile and personal information</li>
            <li>Your posts, comments and contributions</li>
            <li>Your mentorship history and connections</li>
            <li>All other data associated with your account</li>
          </ul>
        </div>
      </Dialog>
    </div>
  );
};

export default PrivacySection;
