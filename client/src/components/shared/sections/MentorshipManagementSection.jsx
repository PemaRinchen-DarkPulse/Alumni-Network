import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import PrimaryButton from '../../ui/primary-button';
import { Switch } from '../../ui/switch';
import { Select } from '../../ui/select';
import { 
  Briefcase, 
  FileText, 
  Video, 
  Code, 
  Users, 
  CheckCircle2,
  FlaskConical,
  Atom,
  Calculator,
  BookOpen,
  Globe,
  Languages,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../../contexts/auth';
import { mentorshipAPI } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';

const MentorshipManagementSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    professionalHeadline: '',
    bio: '',
    expertise: [],
    selectedTopics: [],
    otherTopics: [],
    openForBookings: true,
    maxHoursPerMonth: '3-5',
    timezone: 'Eastern Time (US & Canada)'
  });

  const [currentExpertise, setCurrentExpertise] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [currentOtherTopic, setCurrentOtherTopic] = useState('');

  // Load existing draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!user?.id) return;
      
      try {
        const result = await mentorshipAPI.getProfile(user.id);
        if (result.success && result.data) {
          // Only load if status is 'draft', not 'published'
          if (result.data.status === 'draft') {
            setFormData({
              professionalHeadline: result.data.professionalHeadline || '',
              bio: result.data.bio || '',
              expertise: result.data.expertise || [],
              selectedTopics: result.data.selectedTopics || [],
              otherTopics: result.data.otherTopics || [],
              openForBookings: result.data.openForBookings !== undefined ? result.data.openForBookings : true,
              maxHoursPerMonth: result.data.maxHoursPerMonth || '3-5',
              timezone: result.data.timezone || 'Eastern Time (US & Canada)'
            });
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };

    loadDraft();
  }, [user]);


  const mentorshipTopics = [
    // Professional Skills
    {
      id: 'career-advice',
      title: 'Career Advice',
      description: 'Career guidance on career industry insights.',
      icon: Briefcase,
      category: 'professional'
    },
    {
      id: 'resume-review',
      title: 'Resume Review',
      description: 'Feedback on CVs, cover letters, and portfolios.',
      icon: FileText,
      category: 'professional'
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview',
      description: 'Practice interviews for technical or behavioral interviews.',
      icon: Video,
      category: 'professional'
    },
    {
      id: 'code-review',
      title: 'Code Review',
      description: 'Technical feedback on projects and code quality.',
      icon: Code,
      category: 'professional'
    },
    {
      id: 'leadership',
      title: 'Leadership',
      description: 'Advice on managing teams and communication.',
      icon: Users,
      category: 'professional'
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      description: 'Business planning and startup guidance.',
      icon: Lightbulb,
      category: 'professional'
    },
    {
      id: 'personal-development',
      title: 'Personal Development',
      description: 'Goal setting and professional growth strategies.',
      icon: TrendingUp,
      category: 'professional'
    },
    // Academic Subjects - Sciences
    {
      id: 'chemistry',
      title: 'Chemistry',
      description: 'Help with chemistry concepts and problem solving.',
      icon: FlaskConical,
      category: 'academic'
    },
    {
      id: 'physics',
      title: 'Physics',
      description: 'Physics fundamentals and applications.',
      icon: Atom,
      category: 'academic'
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Math tutoring from basics to advanced topics.',
      icon: Calculator,
      category: 'academic'
    },
    {
      id: 'biology',
      title: 'Biology',
      description: 'Life sciences and biological concepts.',
      icon: Award,
      category: 'academic'
    },
    // Academic Subjects - Languages & Humanities
    {
      id: 'dzongkha',
      title: 'Dzongkha',
      description: 'National language tutoring and guidance.',
      icon: Languages,
      category: 'academic'
    },
    {
      id: 'english',
      title: 'English',
      description: 'English language skills and literature.',
      icon: BookOpen,
      category: 'academic'
    },
    {
      id: 'history',
      title: 'History',
      description: 'Historical knowledge and analysis.',
      icon: Globe,
      category: 'academic'
    },
    {
      id: 'general-studies',
      title: 'General Studies',
      description: 'Comprehensive academic support across subjects.',
      icon: GraduationCap,
      category: 'academic'
    }
  ];

  const handleAddExpertise = (e) => {
    if (e.key === 'Enter' && currentExpertise.trim()) {
      e.preventDefault();
      processExpertiseInput();
    }
  };

  const processExpertiseInput = () => {
    // Split by comma and process each skill
    const skills = currentExpertise
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .filter(skill => !formData.expertise.includes(skill));

    if (skills.length > 0) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, ...skills]
      });
    }
    setCurrentExpertise('');
  };

  const handleExpertiseBlur = () => {
    if (currentExpertise.trim()) {
      processExpertiseInput();
    }
  };

  const handleRemoveExpertise = (skill) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter(s => s !== skill)
    });
  };

  const handleTopicToggle = (topicId) => {
    setFormData({
      ...formData,
      selectedTopics: formData.selectedTopics.includes(topicId)
        ? formData.selectedTopics.filter(t => t !== topicId)
        : [...formData.selectedTopics, topicId]
    });
  };

  const handleOtherTopicBlur = () => {
    if (currentOtherTopic.trim()) {
      processOtherTopics();
    }
  };

  const processOtherTopics = () => {
    const topics = currentOtherTopic
      .split(',')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0)
      .filter(topic => !formData.otherTopics.includes(topic));

    if (topics.length > 0) {
      setFormData({
        ...formData,
        otherTopics: [...formData.otherTopics, ...topics]
      });
    }
    setCurrentOtherTopic('');
  };

  const handleRemoveOtherTopic = (topic) => {
    setFormData({
      ...formData,
      otherTopics: formData.otherTopics.filter(t => t !== topic)
    });
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const profileData = {
        ...formData,
        userId: user.id,
        status: 'draft'
      };

      console.log('Saving draft with data:', profileData);
      const result = await mentorshipAPI.saveDraft(profileData);
      console.log('Save draft result:', result);
      
      if (result.success) {
        // Redirect immediately to dashboard with success message
        navigate('/dashboard', { 
          replace: true,
          state: { message: 'Draft saved successfully! You can continue editing anytime.', type: 'success' }
        });
      } else {
        setError(result.error || 'Failed to save draft');
        console.error('Draft save failed:', result.error);
      }
    } catch (err) {
      setError('An error occurred while saving draft');
      console.error('Save draft error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    console.log('Preview profile:', formData);
    // TODO: Show preview modal or navigate to preview page
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.professionalHeadline.trim()) {
      setError('Please add a professional headline');
      setIsSubmitting(false);
      return;
    }

    if (!formData.bio.trim()) {
      setError('Please add a bio/introduction');
      setIsSubmitting(false);
      return;
    }

    if (formData.expertise.length === 0) {
      setError('Please add at least one area of expertise');
      setIsSubmitting(false);
      return;
    }

    if (formData.selectedTopics.length === 0 && formData.otherTopics.length === 0) {
      setError('Please select at least one mentorship topic');
      setIsSubmitting(false);
      return;
    }

    try {
      const profileData = {
        ...formData,
        userId: user.id,
        status: 'published'
      };

      console.log('Publishing profile with data:', profileData);
      const result = await mentorshipAPI.publish(profileData);
      console.log('Publish result:', result);
      
      if (result.success) {
        // Reload the page immediately to show mentorship dashboard
        window.location.reload();
      } else {
        setError(result.error || 'Failed to publish profile');
        console.error('Publish failed:', result.error);
      }
    } catch (err) {
      setError('An error occurred while publishing profile');
      console.error('Publish error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-3">
            SETUP WIZARD
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set up your Mentorship Profile
          </h1>
          <p className="text-gray-600">
            Share your expertise and guide the next generation. Your profile will be visible to students and recent graduates looking for guidance.
          </p>
        </div>

        {/* Step 1: About You */}
        <Card className="mb-3 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">About You</h2>
          </div>

          <div className="space-y-2">
            {/* Professional Headline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Headline
              </label>
              <Input
                type="text"
                placeholder="Senior Product Designer at TechGuru"
                value={formData.professionalHeadline}
                onChange={(e) => setFormData({ ...formData, professionalHeadline: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear under your name on your profile card
              </p>
            </div>

            {/* Bio/Introduction */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio / Introduction
              </label>
              <Textarea
                placeholder="Tell prospective mentees about your career journey, interests, and how you can help them..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full min-h-[120px]"
              />
            </div>

            {/* Core Expertise */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Core Expertise (Skills)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveExpertise(skill)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Type skills separated by commas (e.g., programming, resume writing)"
                value={currentExpertise}
                onChange={(e) => setCurrentExpertise(e.target.value)}
                onBlur={handleExpertiseBlur}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Step 2: Mentorship Topics */}
        <Card className="mb-3 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Mentorship Topics</h2>
          </div>

          <p className="text-gray-600 mb-3">
            Select the topics you're most comfortable helping with:
          </p>

          {/* Academic Subjects */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Academic Subjects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mentorshipTopics.filter(topic => topic.category === 'academic').map((topic) => {
                const Icon = topic.icon;
                const isSelected = formData.selectedTopics.includes(topic.id);
                
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleTopicToggle(topic.id)}
                    className={`
                      group relative p-4 rounded-xl cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 scale-[0.98]' 
                        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isSelected 
                          ? 'bg-white/20' 
                          : 'bg-gray-50 group-hover:bg-blue-50'
                        }
                      `}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {topic.title}
                        </h4>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Professional Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mentorshipTopics.filter(topic => topic.category === 'professional').map((topic) => {
                const Icon = topic.icon;
                const isSelected = formData.selectedTopics.includes(topic.id);
                
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleTopicToggle(topic.id)}
                    className={`
                      group relative p-4 rounded-xl cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 scale-[0.98]' 
                        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isSelected 
                          ? 'bg-white/20' 
                          : 'bg-gray-50 group-hover:bg-blue-50'
                        }
                      `}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {topic.title}
                        </h4>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Other Topics */}
          <div className="mt-5">
            <div className="flex items-center mb-3">
              <Button
                onClick={() => setShowOtherInput(!showOtherInput)}
                className="px-8 py-3 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                {showOtherInput ? 'Hide Custom Topics' : '+ Custom Topic'}
              </Button>
            </div>
            
            {showOtherInput && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Type topics separated by commas (e.g., AI, Blockchain, Data Science)"
                  value={currentOtherTopic}
                  onChange={(e) => setCurrentOtherTopic(e.target.value)}
                  onBlur={handleOtherTopicBlur}
                  className="w-full"
                />
              </div>
            )}
            
            {formData.otherTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.otherTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {topic}
                    <button
                      onClick={() => handleRemoveOtherTopic(topic)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>

          <PrimaryButton
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Profile'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default MentorshipManagementSection;