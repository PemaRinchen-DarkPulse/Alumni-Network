import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Reusable content card component for dashboard sections
 * @param {string} title - Optional card title
 * @param {React.ReactNode} children - Content to display inside the card
 * @param {string} className - Additional classes to apply
 */
const ContentCard = ({ title, children, className }) => {
  return (
    <div className={cn(
      "rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800",
      className
    )}>
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default ContentCard;
