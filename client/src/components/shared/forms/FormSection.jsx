import React from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Form section component for pages that require form inputs
 * @param {string} title - The section title
 * @param {string} description - The section description
 * @param {string} formTitle - Title for the form section
 * @param {string} formDescription - Description text for the form
 * @param {React.ReactNode} children - Form elements to render
 * @param {Function} onSubmit - Form submission handler
 * @param {string} submitText - Text for submit button (default: "Submit")
 */
const FormSection = ({ 
  title, 
  description, 
  formTitle, 
  formDescription, 
  children, 
  onSubmit = (e) => e.preventDefault(),
  submitText = "Submit"
}) => {
  return (
    <>
      <PageHeader title={title} description={description} />
      
      <div className="mt-6">
        <ContentCard title={formTitle}>
          {formDescription && (
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {formDescription}
            </p>
          )}
          
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
            <form onSubmit={onSubmit} className="space-y-4">
              {children}
              
              <div>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {submitText}
                </button>
              </div>
            </form>
          </div>
        </ContentCard>
      </div>
    </>
  );
};

export default FormSection;
