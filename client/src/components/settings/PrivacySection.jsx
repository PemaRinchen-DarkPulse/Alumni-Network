import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';

// Switch component (reusing from NotificationsSection)
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    showSocialLinks: true,
    showBio: true,
    allowTagging: true,
    allowMessaging: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch privacy settings
  useEffect(() => {
    if (user) {
      // In a real app, fetch from API
      // For now, use mock data
      const mockSettings = {
        showEmail: user.privacySettings?.showEmail ?? false,
        showPhone: user.privacySettings?.showPhone ?? false,
        showSocialLinks: user.privacySettings?.showSocialLinks ?? true,
        showBio: user.privacySettings?.showBio ?? true,
        allowTagging: user.privacySettings?.allowTagging ?? true,
        allowMessaging: user.privacySettings?.allowMessaging ?? true,
      };
      setPrivacySettings(mockSettings);
    }
  }, [user]);
  
  // Handle toggle changes
  const handleToggle = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };
  
  // Save privacy settings
  const saveSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real app, implement API call
      // Mock API call
      setTimeout(() => {
        console.log('Saving privacy settings:', privacySettings);
        setMessage({ 
          type: 'success', 
          text: 'Privacy settings saved successfully!' 
        });
        setLoading(false);
        setHasChanges(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save privacy settings' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    setLoading(true);
    try {
      // In a real app, implement API call to deactivate account
      // Mock API call
      setTimeout(() => {
        console.log('Deactivating account...');
        setShowDeactivateDialog(false);
        logout(navigate); // Log the user out after deactivation
      }, 1000);
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
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Profile Visibility</h3>
            
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
              id="showBio"
              checked={privacySettings.showBio}
              onChange={(value) => handleToggle('showBio', value)}
              label="Show Bio"
              description="Display your bio on your public profile"
            />
          </div>
          
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-bold uppercase text-muted-foreground">Interaction Settings</h3>
            
            <Switch
              id="allowTagging"
              checked={privacySettings.allowTagging}
              onChange={(value) => handleToggle('allowTagging', value)}
              label="Allow Tagging"
              description="Allow other users to tag you in posts and comments"
            />
            
            <Switch
              id="allowMessaging"
              checked={privacySettings.allowMessaging}
              onChange={(value) => handleToggle('allowMessaging', value)}
              label="Allow Direct Messages"
              description="Allow other users to send you direct messages"
            />
          </div>
        </CardContent>
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
