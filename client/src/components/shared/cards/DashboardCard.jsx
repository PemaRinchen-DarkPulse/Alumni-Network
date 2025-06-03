import React from 'react';

/**
 * DashboardCard component for displaying dashboard stats and information.
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.icon - Icon to display in the card
 * @param {React.ReactNode} props.children - Optional additional content
 * @param {Function} props.onClick - Function to call when card is clicked
 */
const DashboardCard = ({ title, description, icon, children, onClick }) => {
  return (
    <div 
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default DashboardCard;
