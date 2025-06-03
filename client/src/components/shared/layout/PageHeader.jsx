import React from 'react';

/**
 * Reusable page header component with title and description
 * @param {string} title - The page title
 * @param {string} description - The page description
 * @param {React.ReactNode} children - Optional additional content to render below description
 */
const PageHeader = ({ title, description, children }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      {description && (
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default PageHeader;
