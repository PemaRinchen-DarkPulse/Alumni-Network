import React from 'react';
import { PrimaryButton } from '@/components/ui/primary-button';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import { Icon } from '../icons/Icon';

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
              <PrimaryButton type="submit">
                Submit Application
              </PrimaryButton>
            </div>
          </form>
        </ContentCard>
      </div>
      
      <div className="mt-6">
        <ContentCard title="Benefits of Mentoring">
          <div className="space-y-3">            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon name="check" size={16} />
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
                <Icon name="user-plus" size={16} />
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
                <Icon name="edit" size={16} />
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
