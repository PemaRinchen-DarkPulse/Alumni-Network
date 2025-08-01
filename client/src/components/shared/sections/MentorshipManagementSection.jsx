import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/auth';
import { Button } from '../../ui/button';
import { SectionLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  getSubjects, 
  getMentorsBySubject, 
  createMentorshipRequest,
  getMentorshipRequestsForMentor,
  getAcceptedMentorshipsForStudent,
  getMentorshipRequestsForStudent,
  getAcceptedMentorshipsForMentor,
  getAcceptedMentorshipsBySubjectForMentor,
  updateMentorshipRequestStatus
} from '../../../services/mentorshipService';
import SectionHero from '@/components/shared/layout/SectionHero';

// Separate Modal Component to avoid re-renders
const MentorshipRequestModal = ({ 
  isOpen, 
  onClose, 
  subjects, 
  mentors, 
  selectedSubject, 
  selectedMentor, 
  reason, 
  goals, 
  isLoading,
  onSubjectChange,
  onMentorChange,
  onReasonChange,
  onGoalsChange,
  onSubmit
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="p-4 m-0 border-b border-gray-200 text-xl">Request New Mentorship</h2>
        <div className="p-5">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="subject-select" className="block mb-1 font-medium">Subject</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={onSubjectChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-base h-10"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="mentor-select" className="block mb-1 font-medium">Mentor</label>
              <select
                id="mentor-select"
                value={selectedMentor}
                onChange={onMentorChange}
                required
                disabled={!selectedSubject || mentors.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded text-base h-10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Select a mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.fullName} - {mentor.company}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reason-textarea" className="block mb-1 font-medium">Reason for Mentorship</label>
              <textarea
                id="reason-textarea"
                rows={3}
                value={reason}
                onChange={onReasonChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-base resize-y min-h-[80px]"
                placeholder="Explain why you're requesting this mentorship..."
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="goals-textarea" className="block mb-1 font-medium">Goals & Expectations</label>
              <textarea
                id="goals-textarea"
                rows={4}
                value={goals}
                onChange={onGoalsChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-base resize-y min-h-[80px]"
                placeholder="Describe your goals and expectations from this mentorship..."
              />
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2.5">
          <button 
            className="px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-gray-700" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={isLoading || !selectedSubject || !selectedMentor || !reason || !goals}
          >
            {isLoading ? 'Sending...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MentorshipManagementSection = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [acceptedMentorships, setAcceptedMentorships] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [mentorMentorships, setMentorMentorships] = useState([]);
  const [activeTab, setActiveTab] = useState('mentorships'); // Default for students, will be updated for alumni
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [reason, setReason] = useState('');
  const [goals, setGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Debug logging for authentication state
    console.log('MentorshipManagementSection - Auth state:', { 
      isAuthenticated, 
      user: user ? { id: user._id, role: user.role, name: user.fullName } : null,
      authLoading 
    });
    
    // Only fetch data when authentication is confirmed and user is available
    if (isAuthenticated && user) {
      // Fetch subjects for both students and alumni
      fetchSubjects();

      // Fetch mentorship data based on user role
      if (user.role === 'student') {
        fetchAcceptedMentorships();
        fetchStudentRequests();
      } else if (user.role === 'alumni') {
        fetchMentorshipRequests();
        fetchMentorMentorships();
      }
    }
  }, [user, isAuthenticated]);

  // Set default active tab based on user role
  useEffect(() => {
    if (user?.role === 'student') {
      setActiveTab('mentorships');
    } else if (user?.role === 'alumni') {
      setActiveTab('mentoring');
    }
  }, [user?.role]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      if (response.success) {
        setSubjects(response.data);
      } else {
        showError('Failed to fetch subjects');
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch subjects');
    }
  };

  const fetchMentorsBySubject = async (subjectId) => {
    try {
      const response = await getMentorsBySubject(subjectId);
      if (response.success) {
        setMentors(response.data);
      } else {
        showError('Failed to fetch mentors');
        setMentors([]);
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch mentors');
      setMentors([]);
    }
  };

  const fetchAcceptedMentorships = async () => {
    if (!isAuthenticated || !user || user.role !== 'student') {
      return;
    }
    
    try {
      const response = await getAcceptedMentorshipsForStudent();
      if (response.success) {
        setAcceptedMentorships(response.data);
      } else {
        showError('Failed to fetch mentorships');
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch mentorships');
    }
  };

  const fetchMentorshipRequests = async () => {
    if (!isAuthenticated || !user || user.role !== 'alumni') {
      return;
    }
    
    try {
      const response = await getMentorshipRequestsForMentor();
      if (response.success) {
        setMentorshipRequests(response.data);
      } else {
        showError('Failed to fetch mentorship requests');
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch mentorship requests');
    }
  };

  const fetchStudentRequests = async () => {
    if (!isAuthenticated || !user || user.role !== 'student') {
      return;
    }
    
    try {
      const response = await getMentorshipRequestsForStudent();
      if (response.success) {
        setStudentRequests(response.data);
      } else {
        showError('Failed to fetch request history');
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch request history');
    }
  };

  const fetchMentorMentorships = async () => {
    if (!isAuthenticated || !user || user.role !== 'alumni') {
      return;
    }
    
    try {
      const response = await getAcceptedMentorshipsBySubjectForMentor();
      if (response.success) {
        setMentorMentorships(response.data);
      } else {
        showError('Failed to fetch mentoring relationships');
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch mentoring relationships');
    }
  };

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedMentor('');
    
    if (subjectId) {
      await fetchMentorsBySubject(subjectId);
    } else {
      setMentors([]);
    }
  };

  const handleMentorChange = (e) => {
    setSelectedMentor(e.target.value);
  };

  const handleReasonChange = useCallback((e) => {
    setReason(e.target.value);
  }, []);

  const handleGoalsChange = useCallback((e) => {
    setGoals(e.target.value);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSubject('');
    setSelectedMentor('');
    setReason('');
    setGoals('');
    setMentors([]);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      showError('You must be logged in to submit a request');
      return;
    }
    
    if (!selectedSubject || !selectedMentor || !reason || !goals) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const requestData = {
        mentorId: selectedMentor,
        subjectId: selectedSubject,
        reason,
        goals
      };
      
      const response = await createMentorshipRequest(requestData);
      
      if (response.success) {
        showSuccess('Mentorship request sent successfully');
        handleCloseModal();
        // Refresh student's request history
        if (user.role === 'student') {
          fetchStudentRequests();
        }
      } else {
        showError(response.error || 'Failed to send request');
      }
    } catch (error) {
      showError(error.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    if (!isAuthenticated || !user || user.role !== 'alumni') {
      showError('You must be logged in as an alumni to update request status');
      return;
    }
    
    try {
      const response = await updateMentorshipRequestStatus(requestId, status);
      
      if (response.success) {
        showSuccess(`Request ${status} successfully`);
        // Refresh both the mentorship requests list and mentoring relationships
        fetchMentorshipRequests();
        fetchMentorMentorships();
      } else {
        showError(response.error || 'Failed to update request status');
      }
    } catch (error) {
      showError(error.message || 'Failed to update request status');
    }
  };

  // Student view component for accepted mentorships and request status
  const StudentView = () => (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-start items-center mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="flex gap-1 w-full">
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'mentorships' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('mentorships')}
          >
            Active Mentorships ({acceptedMentorships.length})
          </button>
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'requests' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Request History ({studentRequests.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'mentorships' && (
        <>
          {acceptedMentorships.length === 0 ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM21 4a2 2 0 11-4 0 2 2 0 014 0zM9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20v-2a2 2 0 01.586-1.414L12 12l3.586 3.586A2 2 0 0116 18v2m-5-5v.01" />
                </svg>
              </div>
              <p className="mb-6 text-lg font-medium text-gray-900">You haven't joined any mentorship programs yet.</p>
              <p className="mb-6 text-gray-600">Connect with experienced alumni to accelerate your learning journey.</p>
              <Button onClick={handleOpenModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Get Started with a New Mentorship
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {acceptedMentorships.map((mentorship) => (
                <div className="rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative" key={mentorship._id}>
                  {/* Card Header with Subject Color and Pattern */}
                  <div 
                    className="h-32 p-4 relative overflow-hidden rounded-t-xl"
                    style={{ 
                      backgroundColor: mentorship.subject.cardColor || '#8B5CF6',
                      backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)
                      `
                    }}
                  >
                    {/* Three-dot menu */}
                    <div className="absolute top-4 right-4">
                      <button className="text-white opacity-70 hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Card Title */}
                    <div className="absolute bottom-4 left-4 right-16">
                      <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                        {mentorship.subject.name} – Mentorship
                      </h3>
                      <p className="text-white text-sm opacity-90">
                        Mentor: {mentorship.mentor.fullName}
                      </p>
                    </div>
                  </div>
                    
                  {/* Card Content */}
                  <div className="p-8 bg-white rounded-b-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium text-gray-900">Joined:</span> {new Date(mentorship.acceptedAt || mentorship.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Mentor Profile Badge - positioned to straddle the border */}
                  <div className="absolute top-32 right-8 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">
                        {mentorship.mentor.fullName?.charAt(0) || 'M'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {studentRequests.length === 0 ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12m-6 8a7.962 7.962 0 01-5.196-2.121L9 20l.063.063A7.952 7.952 0 0012 21a7.952 7.952 0 002.937-.937L15 20v-.021c.662-.413 1.252-.906 1.772-1.465L17 20h5v-2a3 3 0 00-5.196-2.121L17 20z" />
                </svg>
              </div>
              <p className="mb-6 text-lg font-medium text-gray-900">You haven't made any mentorship requests yet.</p>
              <p className="mb-6 text-gray-600">Start your mentoring journey by connecting with an experienced alumni.</p>
              <Button onClick={handleOpenModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Make Your First Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {studentRequests.map((request) => (
                <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105" key={request._id}>
                  {/* Card Header with Subject Color and Pattern */}
                  <div 
                    className="h-32 p-4 relative overflow-hidden"
                    style={{ 
                      backgroundColor: request.subject.cardColor || '#8B5CF6',
                      backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)
                      `
                    }}
                  >
                    {/* Three-dot menu */}
                    <div className="absolute top-4 right-4">
                      <button className="text-white opacity-70 hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Card Title */}
                    <div className="absolute bottom-4 left-4 right-12">
                      <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                        {request.subject.name} – Request
                      </h3>
                      <p className="text-white text-sm opacity-90">
                        Mentor: {request.mentor.fullName}
                      </p>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="absolute bottom-4 right-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        request.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                        request.status === 'accepted' ? 'bg-green-400 text-green-900' :
                        'bg-red-400 text-red-900'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4 bg-white">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium text-gray-900">Your goals:</span> {request.goals}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium text-gray-900">Reason:</span> {request.reason}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                        {request.status === 'rejected' && request.rejectedAt && (
                          <span>Rejected: {new Date(request.rejectedAt).toLocaleDateString()}</span>
                        )}
                        {request.status === 'accepted' && request.acceptedAt && (
                          <span>Accepted: {new Date(request.acceptedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  // Alumni view component for mentorship requests and current mentoring
  const AlumniView = () => (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-start items-center mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="flex gap-1 w-full">
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'mentoring' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('mentoring')}
          >
            My Mentoring ({mentorMentorships.length})
          </button>
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'requests' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            New Requests ({mentorshipRequests.reduce((total, group) => total + group.requests.filter(r => r.status === 'pending').length, 0)})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'mentoring' && (
        <>
          {mentorMentorships.length === 0 ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM21 4a2 2 0 11-4 0 2 2 0 014 0zM9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12" />
                </svg>
              </div>
              <p className="mb-4 text-lg font-medium text-gray-900">You are not currently mentoring any students.</p>
              <p className="text-gray-600">When students request mentorship in your expertise areas, they'll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {mentorMentorships.map((subjectGroup) => (
                <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" key={subjectGroup.subject._id}>
                  {/* Card Header with Subject Color and Pattern */}
                  <div 
                    className="h-32 p-4 relative overflow-hidden"
                    style={{ 
                      backgroundColor: subjectGroup.subject.cardColor || '#8B5CF6',
                      backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)
                      `
                    }}
                  >
                    {/* Three-dot menu */}
                    <div className="absolute top-4 right-4">
                      <button className="text-white opacity-70 hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Card Title */}
                    <div className="absolute bottom-4 left-4 right-12">
                      <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                        {subjectGroup.subject.name} – Mentoring
                      </h3>
                      <p className="text-white text-sm opacity-90">
                        {subjectGroup.studentCount} {subjectGroup.studentCount === 1 ? 'student' : 'students'} enrolled
                      </p>
                    </div>
                    
                    {/* Completion indicator */}
                    <div className="absolute bottom-4 right-4">
                      <div className="text-white text-xs opacity-75">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content - Show general mentorship info */}
                  <div className="p-8 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium text-gray-900">Active since:</span> {new Date(subjectGroup.mentorships[0].acceptedAt || subjectGroup.mentorships[0].createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {/* Check if there are any pending requests across all subjects */}
          {mentorshipRequests.length === 0 || mentorshipRequests.every(group => group.requests.filter(r => r.status === 'pending').length === 0) ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="mb-4 text-lg font-medium text-gray-900">No pending mentorship requests at the moment.</p>
              <p className="text-gray-600">When students request mentorship in your expertise areas, they'll appear here for your review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {mentorshipRequests
                .filter(subjectGroup => subjectGroup.requests.some(r => r.status === 'pending'))
                .map((subjectGroup) => 
                  subjectGroup.requests
                    .filter(request => request.status === 'pending')
                    .map(request => (
                      <div 
                        className="rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 relative cursor-pointer" 
                        key={request._id}
                        onClick={() => {
                          // Show details in an alert or modal
                          alert(`Request Details:\n\nReason: ${request.reason}\n\nGoals: ${request.goals}`);
                        }}
                      >
                        {/* Card Header with Subject Color and Pattern */}
                        <div 
                          className="h-32 p-4 relative overflow-hidden rounded-t-xl"
                          style={{ 
                            backgroundColor: subjectGroup.subject.cardColor || '#8B5CF6',
                            backgroundImage: `
                              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
                              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)
                            `
                          }}
                        >
                          {/* Three-dot menu */}
                          <div className="absolute top-4 right-4">
                            <button className="text-white opacity-70 hover:opacity-100 transition-opacity">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                                <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                                <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                              </svg>
                            </button>
                          </div>
                          
                          {/* Card Title */}
                          <div className="absolute bottom-4 left-4 right-16">
                            <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                              {subjectGroup.subject.name} – Request
                            </h3>
                            <p className="text-white text-sm opacity-90">
                              From: {request.student.name}
                            </p>
                          </div>
                          
                          {/* Status indicator */}
                          <div className="absolute bottom-4 right-4">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-yellow-400 text-yellow-900">
                              Pending
                            </span>
                          </div>
                        </div>
                          
                        {/* Card Content */}
                        <div className="p-6 bg-white rounded-b-xl">
                          {/* Student Info */}
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-200 flex items-center justify-center shadow-sm mr-3">
                              <span className="text-white text-sm font-bold">
                                {request.student.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{request.student.name}</p>
                              <p className="text-sm text-gray-500">
                                Requested on {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                            <button 
                              className="flex-1 px-4 py-2.5 bg-green-600 text-white border-none rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
                              onClick={() => handleUpdateRequestStatus(request._id, 'accepted')}
                            >
                              Accept Request
                            </button>
                            <button 
                              className="flex-1 px-4 py-2.5 bg-white text-red-600 border border-red-600 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 hover:bg-red-50 hover:shadow-lg"
                              onClick={() => handleUpdateRequestStatus(request._id, 'rejected')}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // New mentorship request modal
  const renderModal = () => (
    <MentorshipRequestModal 
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      subjects={subjects}
      mentors={mentors}
      selectedSubject={selectedSubject}
      selectedMentor={selectedMentor}
      reason={reason}
      goals={goals}
      isLoading={isLoading}
      onSubjectChange={handleSubjectChange}
      onMentorChange={handleMentorChange}
      onReasonChange={handleReasonChange}
      onGoalsChange={handleGoalsChange}
      onSubmit={handleSubmitRequest}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-3 mb-5 rounded-lg border border-red-200 shadow-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-3 mb-5 rounded-lg border border-green-200 shadow-sm">
            {successMessage}
          </div>
        )}
        
        {/* Header with conditional button for students */}
        <SectionHero 
          title="Mentorship Management"
          description="Connect with experienced mentors and guide the next generation. Build meaningful relationships that foster growth and learning."
          icon="user-plus"
          gradient="from-purple-600 to-pink-600"
          actionButton={(!authLoading && isAuthenticated && user && user.role === 'student') ? {
            label: "Request New Mentorship",
            icon: "plus",
            onClick: handleOpenModal
          } : undefined}
        />
        
        {/* Show loading state while authentication is being checked */}
        {authLoading && (
          <SectionLoadingSpinner section="mentorship" />
        )}
        
        {/* Show authentication message if user is not authenticated */}
        {!authLoading && !isAuthenticated && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-base text-gray-600 m-0">Please log in to access mentorship management features.</p>
          </div>
        )}
        
        {/* Show content only when user is authenticated */}
        {!authLoading && isAuthenticated && user && (
          <>
            {user.role === 'student' && <StudentView />}
            {user.role === 'alumni' && <AlumniView />}
          </>
        )}
      </div>
      
      {/* Modal - outside the main container */}
      {renderModal()}
    </div>
  );
};

export default MentorshipManagementSection;