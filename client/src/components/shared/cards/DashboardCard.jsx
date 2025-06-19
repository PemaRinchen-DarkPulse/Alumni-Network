import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DashboardCard component for displaying dashboard stats and information.
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.icon - Icon to display in the card
 * @param {React.ReactNode} props.children - Optional additional content
 * @param {Function} props.onClick - Function to call when card is clicked
 * @param {string} props.link - Optional route to link to when the card is clicked
 */
const DashboardCard = ({ title, description, icon, children, onClick, link }) => {
  // Card content is the same regardless of whether it's a link or clickable div
  const cardContent = (
    <>
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
    </>
  );

  // Common styling for the card
  const cardStyle = "rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800";

  // If there's a link, render it as a Link component
  if (link) {
    return (
      <Link 
        to={link}
        className={`${cardStyle} block`}
      >
        {cardContent}
      </Link>
    );
  }
  
  // Otherwise, render as a div with optional onClick
  return (
    <div 
      className={cardStyle}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {cardContent}
    </div>
  );
};

export default DashboardCard;
