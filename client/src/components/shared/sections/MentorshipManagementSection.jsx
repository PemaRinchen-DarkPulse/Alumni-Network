import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/auth';
import { 
  getSubjects, 
  getMentorsBySubject, 
  createMentorshipRequest,
  getMentorshipRequestsForMentor,
  getAcceptedMentorshipsForStudent,
  getMentorshipRequestsForStudent,
  getAcceptedMentorshipsForMentor,
  updateMentorshipRequestStatus
} from '../../../services/mentorshipService';

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
      setActiveTab('requests');
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
      const response = await getAcceptedMentorshipsForMentor();
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

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleGoalsChange = (e) => {
    setGoals(e.target.value);
  };

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
      <div className="flex justify-start items-center mb-5 border-b-2 border-gray-200 pb-2.5">
        <div className="flex gap-2.5">
          <button 
            className={`px-5 py-3 bg-transparent border-none border-b-4 border-transparent cursor-pointer text-base font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-gray-50 ${
              activeTab === 'mentorships' ? 'text-blue-600 border-b-blue-600 bg-gray-50' : ''
            }`}
            onClick={() => setActiveTab('mentorships')}
          >
            Active Mentorships ({acceptedMentorships.length})
          </button>
          <button 
            className={`px-5 py-3 bg-transparent border-none border-b-4 border-transparent cursor-pointer text-base font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-gray-50 ${
              activeTab === 'requests' ? 'text-blue-600 border-b-blue-600 bg-gray-50' : ''
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
            <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg my-5 border-2 border-dashed border-gray-300">
              <p className="mb-4 text-lg">You haven't joined any mentorship programs yet.</p>
              <button 
                className="px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer font-medium text-lg mt-4 transition-colors duration-200 hover:bg-blue-700" 
                onClick={handleOpenModal}
              >
                Get Started with a New Mentorship
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {acceptedMentorships.map((mentorship) => (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white" key={mentorship._id}>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="m-0 text-lg text-gray-800">{mentorship.subject.name}</h3>
                    <p className="mt-1 text-gray-600 text-sm">Mentor: {mentorship.mentor.fullName}</p>
                  </div>
                  <div className="p-4">
                    <p className="mb-2.5 text-gray-700">
                      <strong>Your goals:</strong> {mentorship.goals}
                    </p>
                    <p className="mb-2.5 text-gray-700">
                      <strong>Reason for mentorship:</strong> {mentorship.reason}
                    </p>
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
            <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg my-5 border-2 border-dashed border-gray-300">
              <p className="mb-4 text-lg">You haven't made any mentorship requests yet.</p>
              <button 
                className="px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer font-medium text-lg mt-4 transition-colors duration-200 hover:bg-blue-700" 
                onClick={handleOpenModal}
              >
                Make Your First Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {studentRequests.map((request) => (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white" key={request._id}>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="m-0 text-lg text-gray-800">{request.subject.name}</h3>
                    <p className="mt-1 text-gray-600 text-sm">Mentor: {request.mentor.fullName}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="mb-2.5 text-gray-700">
                      <strong>Your goals:</strong> {request.goals}
                    </p>
                    <p className="mb-2.5 text-gray-700">
                      <strong>Reason for mentorship:</strong> {request.reason}
                    </p>
                    <p className="mb-2.5 text-gray-700">
                      <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.status === 'rejected' && request.rejectedAt && (
                      <p className="mb-2.5 text-gray-700">
                        <strong>Rejected on:</strong> {new Date(request.rejectedAt).toLocaleDateString()}
                      </p>
                    )}
                    {request.status === 'accepted' && request.acceptedAt && (
                      <p className="mb-2.5 text-gray-700">
                        <strong>Accepted on:</strong> {new Date(request.acceptedAt).toLocaleDateString()}
                      </p>
                    )}
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
      <div className="flex justify-start items-center mb-5 border-b-2 border-gray-200 pb-2.5">
        <div className="flex gap-2.5">
          <button 
            className={`px-5 py-3 bg-transparent border-none border-b-4 border-transparent cursor-pointer text-base font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-gray-50 ${
              activeTab === 'requests' ? 'text-blue-600 border-b-blue-600 bg-gray-50' : ''
            }`}
            onClick={() => setActiveTab('requests')}
          >
            New Requests ({mentorshipRequests.reduce((total, group) => total + group.requests.filter(r => r.status === 'pending').length, 0)})
          </button>
          <button 
            className={`px-5 py-3 bg-transparent border-none border-b-4 border-transparent cursor-pointer text-base font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:bg-gray-50 ${
              activeTab === 'mentoring' ? 'text-blue-600 border-b-blue-600 bg-gray-50' : ''
            }`}
            onClick={() => setActiveTab('mentoring')}
          >
            My Mentoring ({mentorMentorships.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && (
        <>
          {mentorshipRequests.length === 0 ? (
            <p className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg my-5 border-2 border-dashed border-gray-300">
              You don't have any mentorship requests at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {mentorshipRequests.map((subjectGroup) => (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white" key={subjectGroup.subject._id}>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="m-0 text-lg text-gray-800">{subjectGroup.subject.name}</h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      {subjectGroup.requests.filter(r => r.status === 'pending').length} pending {
                        subjectGroup.requests.filter(r => r.status === 'pending').length === 1 ? 'request' : 'requests'
                      }
                    </p>
                  </div>
                  <div className="p-4">
                    {subjectGroup.requests
                      .filter(request => request.status === 'pending')
                      .map(request => (
                        <div key={request._id} className="mb-5">
                          <div className="flex items-center mb-2.5">
                            <img 
                              src={request.student.profilePicture || '/default-avatar.png'} 
                              alt={request.student.name}
                              className="w-8 h-8 rounded-full mr-2.5 object-cover"
                            />
                            <span>{request.student.name}</span>
                          </div>
                          
                          <p className="mb-2.5 text-gray-700">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                          
                          <p className="mb-2.5 text-gray-700">
                            <strong>Goals:</strong> {request.goals}
                          </p>
                          
                          <p className="mb-2.5 text-gray-700">
                            <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          
                          <div className="flex gap-2.5">
                            <button 
                              className="px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-green-700"
                              onClick={() => handleUpdateRequestStatus(request._id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button 
                              className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-red-50"
                              onClick={() => handleUpdateRequestStatus(request._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </div>
                          
                          <hr className="my-4 border-0 border-t border-gray-200" />
                        </div>
                      ))}
                      
                      {!subjectGroup.requests.some(request => request.status === 'pending') && (
                        <p className="text-gray-600 italic">
                          No pending requests for this subject.
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'mentoring' && (
        <>
          {mentorMentorships.length === 0 ? (
            <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg my-5 border-2 border-dashed border-gray-300">
              <p>You are not currently mentoring any students.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {mentorMentorships.map((mentorship) => (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white" key={mentorship._id}>
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="m-0 text-lg text-gray-800">{mentorship.subject.name}</h3>
                    <p className="mt-1 text-gray-600 text-sm">Student: {mentorship.student.fullName}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2.5">
                      <img 
                        src={mentorship.student.profilePicture || '/default-avatar.png'} 
                        alt={mentorship.student.fullName}
                        className="w-8 h-8 rounded-full mr-2.5 object-cover"
                      />
                      <div className="flex flex-col ml-2.5">
                        <span className="font-semibold text-gray-800">{mentorship.student.fullName}</span>
                        <span className="text-sm text-gray-600">{mentorship.student.email}</span>
                      </div>
                    </div>
                    
                    <p className="mb-2.5 text-gray-700">
                      <strong>Student's goals:</strong> {mentorship.goals}
                    </p>
                    <p className="mb-2.5 text-gray-700">
                      <strong>Reason for mentorship:</strong> {mentorship.reason}
                    </p>
                    <p className="mb-2.5 text-gray-700">
                      <strong>Started on:</strong> {new Date(mentorship.acceptedAt || mentorship.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  // New mentorship request modal
  const MentorshipRequestModal = () => (
    <div 
      className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 backdrop-blur-sm ${
        isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} 
      onClick={handleCloseModal}
    >
      <div className="bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="p-4 m-0 border-b border-gray-200 text-xl">Request New Mentorship</h2>
        <div className="p-5">
          <form onSubmit={handleSubmitRequest}>
            <div className="mb-4">
              <label htmlFor="subject-select" className="block mb-1 font-medium">Subject</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={handleSubjectChange}
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
                onChange={handleMentorChange}
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
                onChange={handleReasonChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-base resize-y min-h-[80px]"
                placeholder="Explain why you're requesting this mentorship..."
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="goals-textarea" className="block mb-1 font-medium">Goals & Expectations</label>
              <textarea
                id="goals-textarea"
                rows={4}
                value={goals}
                onChange={handleGoalsChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-base resize-y min-h-[80px]"
                placeholder="Describe your goals and expectations from this mentorship..."
              ></textarea>
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2.5">
          <button 
            className="px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-gray-700" 
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer font-medium transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSubmitRequest}
            disabled={isLoading || !selectedSubject || !selectedMentor || !reason || !goals}
          >
            {isLoading ? 'Sending...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2.5 mb-5 rounded border border-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2.5 mb-5 rounded border border-green-200">
          {successMessage}
        </div>
      )}
      
      {/* Header with conditional button for students */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="mb-0 text-3xl text-gray-800">Mentorship Management</h1>
        {!authLoading && isAuthenticated && user && user.role === 'student' && (
          <button 
            className="px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer font-medium text-lg transition-colors duration-200 hover:bg-blue-700" 
            onClick={handleOpenModal}
          >
            Request New Mentorship
          </button>
        )}
      </div>
      
      {/* Show loading state while authentication is being checked */}
      {authLoading && (
        <div className="text-center py-10">
          <p className="text-base text-gray-600 m-0">Loading...</p>
        </div>
      )}
      
      {/* Show authentication message if user is not authenticated */}
      {!authLoading && !isAuthenticated && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-base text-gray-600 m-0">Please log in to access mentorship management features.</p>
        </div>
      )}
      
      {/* Show content only when user is authenticated */}
      {!authLoading && isAuthenticated && user && (
        <>
          {user.role === 'student' && <StudentView />}
          {user.role === 'alumni' && <AlumniView />}
          <MentorshipRequestModal />
        </>
      )}
    </div>
  );
};

export default MentorshipManagementSection;