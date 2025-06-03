import React from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * CollaborationSection component for managing and viewing collaboration opportunities.
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description 
 * @param {Array} props.opportunities - Array of collaboration opportunity objects
 * @param {boolean} props.isAdmin - Whether the user can create and manage opportunities
 * @param {Function} props.onCreateOpportunity - Function called when a new opportunity is created
 * @param {Function} props.onApply - Function called when a user applies for an opportunity
 * @param {Function} props.onManage - Function called when an admin manages an opportunity
 */
const CollaborationSection = ({ 
  title = "Collaboration Opportunities", 
  description = "Explore partnerships between the institution and alumni.",
  opportunities = [],
  isAdmin = false,
  onCreateOpportunity = () => console.log('Create opportunity'),
  onApply = (opportunity) => console.log('Apply for opportunity:', opportunity),
  onManage = (opportunity) => console.log('Manage opportunity:', opportunity)
}) => {
  return (
    <>
      <PageHeader 
        title={title} 
        description={description} 
      />
      
      <div className="mt-6 space-y-6">
        {isAdmin && (
          <ContentCard>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Manage Collaboration Opportunities</h2>
              <button 
                onClick={onCreateOpportunity}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Opportunity
              </button>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Create and manage guest lectures, research collaborations, internship opportunities, and other joint initiatives.
            </p>
          </ContentCard>
        )}
        
        {opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <ContentCard key={index}>
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    opportunity.type === 'Research' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    opportunity.type === 'Internship' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    opportunity.type === 'Guest Lecture' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {opportunity.type}
                  </span>
                </div>
                
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Posted by: {opportunity.postedBy} • {opportunity.date} • {opportunity.status}
                </p>
                
                <div className="mt-3 text-slate-600 dark:text-slate-400">
                  {opportunity.description}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Requirements:</h4>
                  <ul className="mt-1 list-disc list-inside text-slate-600 dark:text-slate-400 text-sm">
                    {opportunity.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-end">
                  {isAdmin ? (
                    <button 
                      onClick={() => onManage(opportunity)}
                      className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
                    >
                      Manage
                    </button>
                  ) : (
                    <button 
                      onClick={() => onApply(opportunity)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </ContentCard>
            ))}
          </div>
        ) : (
          <ContentCard>
            <p className="text-slate-600 dark:text-slate-400">
              No collaboration opportunities are currently available. {isAdmin ? "Create an opportunity to get started!" : "Check back later for new opportunities."}
            </p>
          </ContentCard>
        )}
      </div>
    </>
  );
};

export default CollaborationSection;
