import React from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Mentorship request component for students to request mentorship
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} mentors - Array of available mentors
 * @param {Function} onRequestMentorship - Function to handle mentorship request
 * @param {Array} interestAreas - Interest areas for mentorship
 */
const MentorshipRequestSection = ({
  title = "Request Mentorship",
  description = "Find and connect with alumni mentors for guidance.",
  mentors = [],
  onRequestMentorship = () => {},
  interestAreas = [
    'Career Guidance',
    'Academic Support',
    'Industry Insights',
    'Professional Development',
    'Other'
  ]
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      area: e.target.area.value,
      reason: e.target.reason.value
    };
    
    onRequestMentorship(formData);
  };
  
  return (
    <>
      <PageHeader title={title} description={description} />
      
      <div className="mt-6">
        <ContentCard title="Available Mentors">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Browse through alumni who have volunteered to be mentors and request mentorship based on your interests and career goals.
          </p>
          
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
              <h3 className="font-medium">Mentorship Request Form</h3>
              <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Area of Interest
                  </label>
                  <select 
                    name="area"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
                  >
                    {interestAreas.map((area, index) => (
                      <option key={index} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Why are you seeking mentorship?
                  </label>
                  <textarea 
                    name="reason"
                    rows="3" 
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
                  ></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ContentCard>
      </div>
      
      {mentors.length > 0 && (
        <div className="mt-6">
          <ContentCard title="Featured Mentors">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor, index) => (
                <div 
                  key={index}
                  className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    {mentor.image && (
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src={mentor.image} 
                          alt={mentor.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{mentor.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{mentor.expertise}</p>
                    </div>
                  </div>
                  {mentor.bio && (
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{mentor.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      )}
    </>
  );
};

export default MentorshipRequestSection;
