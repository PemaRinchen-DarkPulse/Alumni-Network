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
import './MentorshipManagementSection.css';

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
    <div className="mentorship-section">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'mentorships' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentorships')}
          >
            Active Mentorships ({acceptedMentorships.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
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
            <div className="empty-state">
              <p>You haven't joined any mentorship programs yet.</p>
              <button 
                className="btn btn-primary btn-large mt-3" 
                onClick={handleOpenModal}
              >
                Get Started with a New Mentorship
              </button>
            </div>
          ) : (
            <div className="mentorship-grid">
              {acceptedMentorships.map((mentorship) => (
                <div className="mentorship-card" key={mentorship._id}>
                  <div className="card-header">
                    <h3>{mentorship.subject.name}</h3>
                    <p className="subheader">Mentor: {mentorship.mentor.fullName}</p>
                  </div>
                  <div className="card-content">
                    <p className="card-text">
                      <strong>Your goals:</strong> {mentorship.goals}
                    </p>
                    <p className="card-text">
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
            <div className="empty-state">
              <p>You haven't made any mentorship requests yet.</p>
              <button 
                className="btn btn-primary btn-large mt-3" 
                onClick={handleOpenModal}
              >
                Make Your First Request
              </button>
            </div>
          ) : (
            <div className="mentorship-grid">
              {studentRequests.map((request) => (
                <div className="mentorship-card" key={request._id}>
                  <div className="card-header">
                    <h3>{request.subject.name}</h3>
                    <p className="subheader">Mentor: {request.mentor.fullName}</p>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="card-content">
                    <p className="card-text">
                      <strong>Your goals:</strong> {request.goals}
                    </p>
                    <p className="card-text">
                      <strong>Reason for mentorship:</strong> {request.reason}
                    </p>
                    <p className="card-text">
                      <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.status === 'rejected' && request.rejectedAt && (
                      <p className="card-text">
                        <strong>Rejected on:</strong> {new Date(request.rejectedAt).toLocaleDateString()}
                      </p>
                    )}
                    {request.status === 'accepted' && request.acceptedAt && (
                      <p className="card-text">
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
    <div className="mentorship-section">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            New Requests ({mentorshipRequests.reduce((total, group) => total + group.requests.filter(r => r.status === 'pending').length, 0)})
          </button>
          <button 
            className={`tab-button ${activeTab === 'mentoring' ? 'active' : ''}`}
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
            <p className="empty-state">
              You don't have any mentorship requests at the moment.
            </p>
          ) : (
            <div className="mentorship-grid">
              {mentorshipRequests.map((subjectGroup) => (
                <div className="mentorship-card" key={subjectGroup.subject._id}>
                  <div className="card-header">
                    <h3>{subjectGroup.subject.name}</h3>
                    <p className="subheader">
                      {subjectGroup.requests.filter(r => r.status === 'pending').length} pending {
                        subjectGroup.requests.filter(r => r.status === 'pending').length === 1 ? 'request' : 'requests'
                      }
                    </p>
                  </div>
                  <div className="card-content">
                    {subjectGroup.requests
                      .filter(request => request.status === 'pending')
                      .map(request => (
                        <div key={request._id} className="request-item">
                          <div className="student-info">
                            <img 
                              src={request.student.profilePicture || '/default-avatar.png'} 
                              alt={request.student.name}
                              className="student-avatar"
                            />
                            <span>{request.student.name}</span>
                          </div>
                          
                          <p className="request-detail">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                          
                          <p className="request-detail">
                            <strong>Goals:</strong> {request.goals}
                          </p>
                          
                          <p className="request-detail">
                            <strong>Requested on:</strong> {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          
                          <div className="action-buttons">
                            <button 
                              className="btn btn-accept"
                              onClick={() => handleUpdateRequestStatus(request._id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button 
                              className="btn btn-reject"
                              onClick={() => handleUpdateRequestStatus(request._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </div>
                          
                          <hr className="divider" />
                        </div>
                      ))}
                      
                      {!subjectGroup.requests.some(request => request.status === 'pending') && (
                        <p className="no-requests">
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
            <div className="empty-state">
              <p>You are not currently mentoring any students.</p>
            </div>
          ) : (
            <div className="mentorship-grid">
              {mentorMentorships.map((mentorship) => (
                <div className="mentorship-card" key={mentorship._id}>
                  <div className="card-header">
                    <h3>{mentorship.subject.name}</h3>
                    <p className="subheader">Student: {mentorship.student.fullName}</p>
                  </div>
                  <div className="card-content">
                    <div className="student-info">
                      <img 
                        src={mentorship.student.profilePicture || '/default-avatar.png'} 
                        alt={mentorship.student.fullName}
                        className="student-avatar"
                      />
                      <div className="student-details">
                        <span className="student-name">{mentorship.student.fullName}</span>
                        <span className="student-email">{mentorship.student.email}</span>
                      </div>
                    </div>
                    
                    <p className="card-text">
                      <strong>Student's goals:</strong> {mentorship.goals}
                    </p>
                    <p className="card-text">
                      <strong>Reason for mentorship:</strong> {mentorship.reason}
                    </p>
                    <p className="card-text">
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
    <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Request New Mentorship</h2>
        <div className="modal-body">
          <form onSubmit={handleSubmitRequest}>
            <div className="form-group">
              <label htmlFor="subject-select">Subject</label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={handleSubjectChange}
                required
                className="form-control"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="mentor-select">Mentor</label>
              <select
                id="mentor-select"
                value={selectedMentor}
                onChange={handleMentorChange}
                required
                disabled={!selectedSubject || mentors.length === 0}
                className="form-control"
              >
                <option value="">Select a mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.fullName} - {mentor.company}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="reason-textarea">Reason for Mentorship</label>
              <textarea
                id="reason-textarea"
                rows={3}
                value={reason}
                onChange={handleReasonChange}
                required
                className="form-control"
                placeholder="Explain why you're requesting this mentorship..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="goals-textarea">Goals & Expectations</label>
              <textarea
                id="goals-textarea"
                rows={4}
                value={goals}
                onChange={handleGoalsChange}
                required
                className="form-control"
                placeholder="Describe your goals and expectations from this mentorship..."
              ></textarea>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
          <button 
            className="btn btn-primary"
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
    <div className="mentorship-management">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* Header with conditional button for students */}
      <div className="page-header">
        <h1 className="page-title">Mentorship Management</h1>
        {!authLoading && isAuthenticated && user && user.role === 'student' && (
          <button 
            className="btn btn-primary btn-large" 
            onClick={handleOpenModal}
          >
            Request New Mentorship
          </button>
        )}
      </div>
      
      {/* Show loading state while authentication is being checked */}
      {authLoading && (
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      )}
      
      {/* Show authentication message if user is not authenticated */}
      {!authLoading && !isAuthenticated && (
        <div className="auth-required">
          <p>Please log in to access mentorship management features.</p>
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