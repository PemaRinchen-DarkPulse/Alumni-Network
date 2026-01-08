import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { eventAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  CalendarDays,
  MapPin,
  Settings,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Image,
  Upload,
  Users,
  Clock
} from 'lucide-react';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    meetingLink: '',
    isVirtual: false,
    visibility: 'public',
    maxAttendees: '',
    bannerImage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    const loadLatestDraft = async () => {
      if (!user?.id) {
        setLoadingDraft(false);
        return;
      }

      try {
        const result = await eventAPI.getLatestDraft(user.id);
        
        if (result.success && result.data) {
          const draft = result.data;
          
          // Parse datetime into date and time
          const startDate = draft.startDateTime ? draft.startDateTime.split('T')[0] : '';
          const startTime = draft.startDateTime ? draft.startDateTime.split('T')[1].substring(0, 5) : '';
          const endDate = draft.endDateTime ? draft.endDateTime.split('T')[0] : '';
          const endTime = draft.endDateTime ? draft.endDateTime.split('T')[1].substring(0, 5) : '';
          
          // Set form data
          setFormData({
            title: draft.title || '',
            description: draft.description || '',
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            location: draft.location || '',
            meetingLink: draft.meetingLink || '',
            isVirtual: draft.isVirtual || false,
            visibility: draft.visibility || 'public',
            maxAttendees: draft.maxAttendees || '',
            bannerImage: draft.bannerImageUrl || null
          });
          
          // Set image preview if exists
          if (draft.bannerImageUrl) {
            const imageData = draft.bannerImageUrl.startsWith('data:') 
              ? draft.bannerImageUrl 
              : `data:image/png;base64,${draft.bannerImageUrl}`;
            setImagePreview(imageData);
          }
          
          setDraftId(draft.id);
          console.log('Loaded draft:', draft.id);
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      } finally {
        setLoadingDraft(false);
      }
    };

    loadLatestDraft();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for storage
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, bannerImage: base64 }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, bannerImage: null }));
    setImagePreview(null);
  };

  const formatEventData = () => {
    // Combine date and time into LocalDateTime format
    const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
    const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
    
    return {
      title: formData.title,
      description: formData.description,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      location: formData.location || null,
      meetingLink: formData.meetingLink || null,
      isVirtual: formData.isVirtual,
      visibility: formData.visibility,
      maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
      bannerImageUrl: formData.bannerImage || null,
      createdBy: user?.id
    };
  };

  const validateForm = () => {
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (!formData.isVirtual && !formData.location) {
      setError('Please provide a location for in-person events');
      return false;
    }
    
    if (formData.isVirtual && !formData.meetingLink) {
      setError('Please provide a meeting link for virtual events');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const eventData = formatEventData();
      console.log('Sending draft data:', { ...eventData, bannerImageUrl: eventData.bannerImageUrl ? `${eventData.bannerImageUrl.substring(0, 50)}...` : null });
      
      let result;
      if (draftId) {
        // Update existing draft
        result = await eventAPI.updateEvent(draftId, eventData);
      } else {
        // Create new draft
        result = await eventAPI.saveDraft(eventData);
      }
      
      if (result.success) {
        alert('Event draft saved successfully!');
        navigate('/dashboard/events');
      } else {
        console.error('Draft save failed:', result.error);
        setError(result.error || 'Failed to save draft');
      }
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(`An error occurred while saving the draft: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const eventData = { ...formatEventData(), status: 'published' };
      console.log('Sending publish data:', { ...eventData, bannerImageUrl: eventData.bannerImageUrl ? `${eventData.bannerImageUrl.substring(0, 50)}...` : null });
      
      let result;
      if (draftId) {
        // Update existing draft to published
        result = await eventAPI.updateEvent(draftId, eventData);
      } else {
        // Create new published event
        result = await eventAPI.publishEvent(eventData);
      }
      
      if (result.success) {
        alert('Event published successfully!');
        navigate('/dashboard/events');
      } else {
        console.error('Publish failed:', result.error);
        setError(result.error || 'Failed to publish event');
      }
    } catch (err) {
      console.error('Error publishing event:', err);
      setError(`An error occurred while publishing the event: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingDraft ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading draft...</span>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          {draftId && (
            <p className="text-sm text-blue-600 mb-2">Continuing from your saved draft</p>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              className="px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Annual Alumni Gala 2024"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      {/* Rich Text Toolbar */}
                      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
                        <button className="p-2 hover:bg-gray-200 rounded" title="Bold">
                          <Bold className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded" title="Italic">
                          <Italic className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded" title="Underline">
                          <Underline className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded" title="List">
                          <List className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded" title="Link">
                          <Link className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded" title="Image">
                          <Image className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <Textarea
                        placeholder="Write a detailed description about the event..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full min-h-[180px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Banner */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Event Banner</h2>
                <p className="text-sm text-blue-600 mb-4">
                  Upload a high-quality image to capture attention. Recommended size: 1200×600px.
                </p>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Event banner preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="banner-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          ) : (
                            <Upload className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <p className="text-gray-900 font-medium mb-1">
                          {uploadingImage ? 'Processing...' : 'Click or drag image to upload'}
                        </p>
                        <p className="text-sm text-gray-500">
                          SVG, PNG, JPG or GIF (max. 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Date & Time */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase">
                      Start
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2 uppercase">
                      End
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Virtual Event</span>
                    <Switch
                      checked={formData.isVirtual}
                      onChange={(checked) => handleInputChange('isVirtual', checked)}
                    />
                  </div>

                  {formData.isVirtual ? (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Meeting Link
                      </label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="e.g., https://zoom.us/j/123456789 or Google Meet link"
                          value={formData.meetingLink}
                          onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                          className="pl-10"
                          type="url"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Add your Zoom, Google Meet, Microsoft Teams, or other meeting link
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Venue / Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Map Placeholder */}
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Map will appear here</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(value) => handleInputChange('visibility', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public (Everyone)</SelectItem>
                        <SelectItem value="private">Private (Invite Only)</SelectItem>
                        <SelectItem value="alumni">Alumni Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Attendees
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="Enter limit (e.g., 50)"
                        value={formData.maxAttendees}
                        onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for unlimited registration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default CreateEventPage;
