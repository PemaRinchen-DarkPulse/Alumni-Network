import React from 'react';
import BlogSection from '../components/shared/sections/BlogSection';
import PageHeader from '../components/shared/layout/PageHeader';

const BlogListPage = () => {
  return (
    <div>
      <PageHeader 
        title="Blog" 
        description="Discover insights, stories, and knowledge shared by our community."
      />
      <BlogSection />
    </div>
  );
};

export default BlogListPage;
