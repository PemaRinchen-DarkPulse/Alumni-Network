import React from 'react';
import PageHeader from './PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * Page section component that combines a header with content
 * @param {string} title - The section title
 * @param {string} description - The section description
 * @param {string} cardTitle - Optional title for the content card
 * @param {React.ReactNode} children - Content to display in the card
 * @param {string} className - Additional CSS classes for the content card
 */
const PageSection = ({ 
  title, 
  description, 
  cardTitle, 
  children, 
  className 
}) => {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="mt-6">
        <ContentCard title={cardTitle} className={className}>
          {children}
        </ContentCard>
      </div>
    </>
  );
};

export default PageSection;
