import React from 'react';
import BlogSection from '../components/shared/sections/BlogSection';
import PageHeader from '../components/shared/layout/PageHeader';

const BlogListPage = () => {
  return (
    <div>
      <PageHeader 
        title="Blog" 
        description="Discover insights, stories, and knowledge shared by our alumni and educator community."
        icon="file-text"
        gradient="from-emerald-500 to-teal-600"
      />
      <BlogSection />
    </div>
  );
};

export default BlogListPage;
