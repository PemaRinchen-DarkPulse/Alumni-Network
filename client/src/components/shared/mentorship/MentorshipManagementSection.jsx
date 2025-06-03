import React, { useState } from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Mentorship management component for alumni mentors
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} requests - Array of mentorship requests
 * @param {Array} mentees - Array of current mentees
 * @param {Function} onAcceptRequest - Function to handle accepting a request
 * @param {Function} onRejectRequest - Function to handle rejecting a request
 * @param {Function} onScheduleSession - Function to schedule a mentorship session
 */
const MentorshipManagementSection = ({
  title = "Mentorship Program",
  description = "Connect with mentees and provide guidance as a mentor.",
  requests = [],
  mentees = [],
  onAcceptRequest = () => {},
  onRejectRequest = () => {},
  onScheduleSession = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('requests');
  
  return (
    <>
      <PageHeader title={title} description={description} />
      
      <div className="mt-6">
        <ContentCard>
          <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex space-x-6">
              <button
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'requests' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                }`}
                onClick={() => setActiveTab('requests')}
              >
                Mentorship Requests
              </button>
              <button
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'mentees' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                }`}
                onClick={() => setActiveTab('mentees')}
              >
                Active Mentorships
              </button>
            </div>
          </div>
          
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Mentorship Requests</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Students who have requested your mentorship
              </p>
              
              {requests.length > 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {requests.map((request, index) => (
                    <div key={index} className="py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {request.studentName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Area of interest: {request.area}
                          </p>
                          <p className="mt-2 text-slate-600 dark:text-slate-300">
                            {request.message}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onAcceptRequest(request)}
                            className="rounded bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary-dark"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onRejectRequest(request)}
                            className="rounded bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  You don't have any pending mentorship requests.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'mentees' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Your Mentees</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Manage your mentorship relationships, schedule meetings, and track progress of your mentees.
              </p>
              
              {mentees.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mentees.map((mentee, index) => (
                    <div 
                      key={index}
                      className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        {mentee.image && (
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img 
                              src={mentee.image} 
                              alt={mentee.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {mentee.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {mentee.focus}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => onScheduleSession(mentee)}
                          className="rounded bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary-dark"
                        >
                          Schedule Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  You don't have any active mentorships yet.
                </div>
              )}
            </div>
          )}
        </ContentCard>
      </div>
    </>
  );
};

export default MentorshipManagementSection;
