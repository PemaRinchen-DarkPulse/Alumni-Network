import React from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Become a mentor component for alumni
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Function} onSubmit - Function to handle form submission
 * @param {Array} expertiseAreas - Expertise areas to choose from
 */
const BecomeMentorSection = ({
  title = "Become a Mentor",
  description = "Share your expertise and guide the next generation.",
  onSubmit = () => {},
  expertiseAreas = [
    'Career Development',
    'Academic Guidance',
    'Professional Skills',
    'Industry Insights',
    'Other'
  ]
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      expertise: e.target.expertise.value,
      experience: e.target.experience.value,
      motivation: e.target.motivation.value,
      availability: e.target.availability.value
    };
    
    onSubmit(formData);
  };
  
  return (
    <>
      <PageHeader title={title} description={description} />
      
      <div className="mt-6">
        <ContentCard title="Mentor Application">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Complete the form below to apply as a mentor. Your application will be reviewed and you'll be notified once it's approved.
          </p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Area of Expertise
              </label>
              <select 
                name="expertise"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
              >
                {expertiseAreas.map((area, index) => (
                  <option key={index} value={area}>{area}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Years of Experience
              </label>
              <input 
                type="number" 
                name="experience"
                min="1" 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Why do you want to become a mentor?
              </label>
              <textarea 
                name="motivation"
                rows="4" 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Availability (hours per week)
              </label>
              <select 
                name="availability"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
              >
                <option>1-2 hours</option>
                <option>3-5 hours</option>
                <option>5-10 hours</option>
                <option>10+ hours</option>
              </select>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Submit Application
              </button>
            </div>
          </form>
        </ContentCard>
      </div>
      
      <div className="mt-6">
        <ContentCard title="Benefits of Mentoring">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Give Back</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Share your knowledge and experience to help guide the next generation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Expand Your Network</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Build meaningful relationships with students and fellow mentors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Develop Leadership Skills</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enhance your coaching, communication, and leadership abilities.
                </p>
              </div>
            </div>
          </div>
        </ContentCard>
      </div>
    </>
  );
};

export default BecomeMentorSection;
