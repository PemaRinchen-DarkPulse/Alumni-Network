import React from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * TributeSection component for showing and submitting teacher tributes.
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {Array} props.tributes - Array of tribute objects
 * @param {boolean} props.showSubmitForm - Whether to show the tribute submission form
 * @param {Function} props.onSubmitTribute - Function called when a new tribute is submitted
 */
const TributeSection = ({ 
  title = "Tribute to Teachers", 
  description = "Honor and appreciate the educators who made a difference.",
  tributes = [],
  showSubmitForm = true,
  onSubmitTribute = () => console.log('Submit tribute')
}) => {
  return (
    <>
      <PageHeader 
        title={title} 
        description={description} 
      />

      <div className="mt-6 space-y-6">
        {showSubmitForm && (
          <ContentCard>
            <h2 className="text-lg font-semibold mb-4">Share Your Tribute</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Teacher's Name
                </label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600" 
                  placeholder="Enter teacher's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Years Known
                </label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600" 
                  placeholder="e.g. 2015-2018"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Tribute
                </label>
                <textarea 
                  rows="4"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600"
                  placeholder="Share how this teacher impacted your life..."
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="button"
                  onClick={onSubmitTribute}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Submit Tribute
                </button>
              </div>
            </form>
          </ContentCard>
        )}
        
        {tributes.length > 0 ? (
          <div className="space-y-4">
            {tributes.map((tribute, index) => (
              <ContentCard key={index}>
                <h3 className="font-semibold text-lg">{tribute.teacherName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{tribute.years}</p>
                <div className="mt-4 text-slate-600 dark:text-slate-400">
                  {tribute.content}
                </div>
                <div className="mt-2 text-right text-sm text-slate-500 dark:text-slate-400">
                  - {tribute.author}
                </div>
              </ContentCard>
            ))}
          </div>
        ) : (
          <ContentCard>
            <p className="text-slate-600 dark:text-slate-400">
              No tributes have been shared yet. Be the first to honor a teacher who made a difference in your life!
            </p>
          </ContentCard>
        )}
      </div>
    </>
  );
};

export default TributeSection;
