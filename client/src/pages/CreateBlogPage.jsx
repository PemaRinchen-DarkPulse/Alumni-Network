import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth';
import { blogAPI } from '@/services/api';
import { 
  Image, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Quote, 
  Heading2, 
  Heading3,
  Code,
  X,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [draftId, setDraftId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Categories available for blog posts
  const categories = [
    'Career Advice',
    'Campus News',
    'Research & Innovation',
    'Events & Reunions',
    'Student Life',
    'Industry Insights',
    'Alumni Stories',
    'Technology',
    'Entrepreneurship',
    'Other'
  ];

  // Load latest draft on mount
  useEffect(() => {
    const loadLatestDraft = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await blogAPI.getLatestDraft(user.id);
        
        if (result.success && result.data && result.data.id) {
          const draft = result.data;
          
          setFormData({
            title: draft.title || '',
            content: draft.content || '',
            category: draft.category || '',
            tags: draft.tags || [],
            featuredImage: draft.featuredImageUrl || null
          });
          
          if (draft.featuredImageUrl) {
            const imageData = draft.featuredImageUrl.startsWith('data:') 
              ? draft.featuredImageUrl 
              : `data:image/png;base64,${draft.featuredImageUrl}`;
            setImagePreview(imageData);
          }
          
          setDraftId(draft.id);
          toast.info('Continuing from your saved draft');
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLatestDraft();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        featuredImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
    setImagePreview(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Text formatting functions for the content textarea
  const insertFormatting = (before, after = '') => {
    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newText
    }));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error('Please add a title to save draft');
      return;
    }

    setIsSaving(true);
    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        authorId: user?.id,
        authorName: `${user?.firstName} ${user?.lastName}`
      };

      let result;
      if (draftId) {
        result = await blogAPI.updatePost(draftId, blogData);
      } else {
        result = await blogAPI.saveDraft(blogData);
      }

      if (result.success) {
        toast.success('Draft saved successfully');
        if (!draftId && result.data?.id) {
          setDraftId(result.data.id);
        }
        setTimeout(() => {
          navigate('/dashboard/blog');
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to save draft');
      }
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please add a title');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please add content');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        authorId: user?.id,
        authorName: `${user?.firstName} ${user?.lastName}`
      };

      let result;
      if (draftId) {
        // Update draft and then publish
        await blogAPI.updatePost(draftId, blogData);
        result = await blogAPI.publishDraft(draftId);
      } else {
        result = await blogAPI.publishPost(blogData);
      }

      if (result.success) {
        toast.success('Blog published successfully!');
        setTimeout(() => {
          navigate('/dashboard/blog');
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to publish blog');
      }
    } catch (error) {
      toast.error('Failed to publish blog');
      console.error('Error publishing blog:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Blog Post</h1>
          <p className="text-gray-600 mb-4">Share your knowledge, experiences, and insights with the alumni network.</p>
          {draftId && (
            <p className="text-sm text-blue-600 mb-2">Continuing from your saved draft</p>
          )}
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-6"
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSaving ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
                {/* Blog Details */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Details</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blog Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter your blog title..."
                          className="w-full"
                          maxLength={200}
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          {formData.title.length}/200 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                          {/* Formatting Toolbar */}
                          <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
                            <button
                              onClick={() => insertFormatting('## ', '')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Heading 2"
                              type="button"
                            >
                              <Heading2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => insertFormatting('### ', '')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Heading 3"
                              type="button"
                            >
                              <Heading3 className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            <button
                              onClick={() => insertFormatting('**', '**')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Bold"
                              type="button"
                            >
                              <Bold className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => insertFormatting('*', '*')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Italic"
                              type="button"
                            >
                              <Italic className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            <button
                              onClick={() => insertFormatting('\n- ', '')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Bullet List"
                              type="button"
                            >
                              <List className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => insertFormatting('\n1. ', '')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Numbered List"
                              type="button"
                            >
                              <ListOrdered className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="w-px h-6 bg-gray-300 mx-1"></div>
                            <button
                              onClick={() => insertFormatting('\n> ', '')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Quote"
                              type="button"
                            >
                              <Quote className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => insertFormatting('`', '`')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Code"
                              type="button"
                            >
                              <Code className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => insertFormatting('[', '](url)')}
                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Link"
                              type="button"
                            >
                              <LinkIcon className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Text Area */}
                          <Textarea
                            id="content-editor"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Write your blog content here... You can use Markdown formatting."
                            className="w-full min-h-[400px] border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Featured Image</h2>
                    <p className="text-sm text-blue-600 mb-4">
                      Upload an eye-catching image for your blog post. Recommended size: 1200×630px.
                    </p>
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          onClick={removeImage}
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </CardContent>
                </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Selection */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags (Max 5)
                </label>
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter"
                  className="w-full mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        type="button"
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Writing Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Use clear, engaging headlines</li>
                  <li>• Break content into sections</li>
                  <li>• Add relevant images</li>
                  <li>• Use markdown for formatting</li>
                  <li>• Include tags for discoverability</li>
                  <li>• Proofread before publishing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Author</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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

export default CreateBlogPage;
