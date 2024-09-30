import React, { useState } from 'react';
import './style.css'; // Make sure to import your CSS file
import {UserFilter} from '../mentoring/mentee';

const alumniData = [
  {
    id: 1,
    name: 'Jane Doe',
    graduationYear: 2015,
    degree: 'Computer Science',
    jobTitle: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    bio: 'A passionate software developer specializing in frontend technologies.',
    skills: ['JavaScript', 'React', 'CSS'],
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'John Smith',
    graduationYear: 2017,
    degree: 'Business Administration',
    jobTitle: 'Product Manager',
    company: 'BizInc',
    location: 'New York, NY',
    bio: 'Experienced in product development and project management.',
    skills: ['Project Management', 'Leadership', 'Agile'],
    profilePic: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    graduationYear: 2016,
    degree: 'Marketing',
    jobTitle: 'Marketing Specialist',
    company: 'BrandCorp',
    location: 'Los Angeles, CA',
    bio: 'Creative marketer with a focus on digital branding strategies.',
    skills: ['SEO', 'Social Media', 'Content Marketing'],
    profilePic: 'https://via.placeholder.com/150',
  },
];

export const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAlumni = alumniData.filter(
    (alumni) =>
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.graduationYear.toString().includes(searchTerm)
  );

  return (
    <div className="directory-container">
      <h1 className="directory-header" style={{marginTop:"60px"}}>Alumni Directory</h1>
      <UserFilter/>

      <div className="alumni-list">
        {filteredAlumni.map((alumni) => (
          <div key={alumni.id} className="alumni-card">
            <img src={alumni.profilePic} alt={alumni.name} className="profile-pic" />
            <div className="alumni-details">
              <h2>{alumni.name}</h2>
              <p className="graduation-year"><strong>Class of {alumni.graduationYear}</strong></p>
              <p className="degree">{alumni.degree}</p>
              <p className="job">{alumni.jobTitle} at {alumni.company}</p>
              <p className="location">{alumni.location}</p>
              <p className="bio">{alumni.bio}</p>
              <button className="connect-button">Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AlumniMessage=()=>{
  return(
    <div >
      <h1 style={{marginTop:"75px"}}>My message</h1>
    </div>
  )
}


export const AlumniForum = () => {
  const forumData = [
    {
      title: 'General Discussion',
      description: 'Come hang out and discuss alumni-related content! Please check other subforums before posting.'
    },
    {
      title: 'Career Development & Job Opportunities',
      description: 'News, advice, and job openings from alumni!'
    },
    {
      title: 'Events & Reunions',
      description: 'Discuss upcoming alumni events and reunions.'
    },
    {
      title: 'Professional Networking',
      description: 'Connect with fellow alumni for professional growth.'
    },
    {
      title: 'Volunteer & Giving Back',
      description: 'Find opportunities to give back to the community and alma mater.'
    }
  ];

  return (
    <div className="forum-container mb-5" style={{marginTop:"120px"}}>
      <h1>The Hub</h1>
      <div className="forum-section">
        {forumData.map((forum, index) => (
          <ForumItem key={index} title={forum.title} description={forum.description} />
        ))}
      </div>
    </div>
  );
};


const ForumItem = ({ title, description }) => {
  // State to manage message visibility
  const [showMessages, setShowMessages] = useState(false);

  // Sample previous messages
  const previousMessages = [
    "This is the first message in the forum.",
    "Here’s another interesting post from alumni.",
    "We’re organizing a reunion next month!",
  ];

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  const createPost = () => {
    alert(`Create post in "${title}" forum.`);
  };

  return (
    <div className="forum-item">
      <div className="forum-info">
        <h2>{title}</h2>
        <p>{description}</p>
        {/* Button to toggle the visibility of previous messages */}
        <button className="view-messages-btn" onClick={toggleMessages}>
          {showMessages ? 'Hide Previous Messages' : 'View Previous Messages'}
        </button>
        {showMessages && (
          <div className="messages-container">
            <ul>
              {previousMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="create-post-btn" onClick={createPost}>
        Create Post
      </button>
    </div>
  );
};