import React, { useState } from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Feedback section component for collecting and displaying feedback
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} feedbackItems - Array of feedback items
 * @param {Function} onSubmitFeedback - Function to handle feedback submission
 * @param {boolean} showSubmitForm - Whether to show the feedback submission form
 * @param {Array} categories - Feedback categories for filtering
 */
const FeedbackSection = ({
  title = "Feedback",
  description = "Submit and view feedback about the institution and programs.",
  feedbackItems = [],
  onSubmitFeedback = () => {},
  showSubmitForm = true,
  categories = ['All', 'Academic', 'Facilities', 'Faculty', 'Events', 'Alumni Network']
}) => {
  const [filter, setFilter] = useState('All');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState(categories[0]);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  
  // Filter feedback items by category
  const filteredFeedback = filter === 'All' 
    ? feedbackItems 
    : feedbackItems.filter(item => item.category === filter);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedbackTitle.trim() || !feedbackText.trim()) {
      return;
    }
    
    onSubmitFeedback({
      title: feedbackTitle,
      text: feedbackText,
      category: feedbackCategory
    });
    
    // Reset form
    setFeedbackTitle('');
    setFeedbackText('');
    setFeedbackCategory(categories[0]);
  };
  
  return (
    <>
      <PageHeader title={title} description={description} />
      
      {showSubmitForm && (
        <div className="mb-6">
          <ContentCard title="Submit Feedback">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Feedback Title
                </label>
                <input
                  type="text"
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                >
                  {categories.slice(1).map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Feedback
                </label>
                <textarea
                  rows="4"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  placeholder="Please share your thoughts and suggestions..."
                  required
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </ContentCard>
        </div>
      )}
      
      <div className="mb-6">
        <ContentCard>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {filter === 'All' ? 'All Feedback' : `${filter} Feedback`}
            </h2>
            
            <select
              className="rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </ContentCard>
      </div>
      
      {filteredFeedback.length > 0 ? (
        <div className="space-y-4">
          {filteredFeedback.map((item, index) => (
            <ContentCard key={index}>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.category}
                  </span>
                </div>
                
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
                
                <div className="mt-3 flex items-center border-t border-slate-200 pt-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <div className="flex items-center">
                    {item.author && (
                      <>
                        {item.author.image && (
                          <img 
                            src={item.author.image} 
                            alt={item.author.name} 
                            className="mr-2 h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="mr-2">{item.author.name}</span>
                      </>
                    )}
                    
                    {item.date && (
                      <span>{item.date}</span>
                    )}
                  </div>
                  
                  {item.status && (
                    <span className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${
                      item.status === 'Open' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : item.status === 'In Progress' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            </ContentCard>
          ))}
        </div>
      ) : (
        <ContentCard>
          <div className="py-8 text-center text-slate-500">
            No feedback found matching your criteria.
          </div>
        </ContentCard>
      )}
    </>
  );
};

export default FeedbackSection;
