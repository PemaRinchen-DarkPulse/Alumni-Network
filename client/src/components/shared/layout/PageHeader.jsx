import React from 'react';
import SectionHero from './SectionHero';

/**
 * Reusable page header component with title and description
 * Now uses the standardized SectionHero component for consistency
 * @param {string} title - The page title
 * @param {string} description - The page description
 * @param {string} icon - Optional icon name for the header
 * @param {string} gradient - Optional gradient override for the header
 * @param {object} actionButton - Optional action button { label, icon, onClick }
 * @param {React.ReactNode} children - Optional additional content to render below description
 */
const PageHeader = ({ 
  title, 
  description, 
  icon,
  gradient,
  actionButton,
  children,
  // Legacy support - if useSimple is true, uses the old simple header
  useSimple = false
}) => {
  if (useSimple) {
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
  }

  return (
    <div className="mb-6">
      <SectionHero 
        title={title}
        description={description}
        icon={icon}
        gradient={gradient}
        actionButton={actionButton}
      />
      {children}
    </div>
  );
};

export default PageHeader;
