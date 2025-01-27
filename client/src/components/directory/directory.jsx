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
        title: 'General Discussion General Discussion General Discussion',
        description: 'Come hang out and discuss alumni-related content! Please check other subforums before posting.',
        views: '25k',
        likes: '1.5k',
        comments: '300',
      },
      {
        title: 'Career Development & Job Opportunities',
        description: 'News, advice, and job openings from alumni!',
        views: '15k',
        likes: '950',
        comments: '250',
      },
      {
        title: 'Events & Reunions',
        description: 'Discuss upcoming alumni events and reunions.',
        views: '12k',
        likes: '850',
        comments: '200',
      },
      {
        title: 'Professional Networking',
        description: 'Connect with fellow alumni for professional growth.',
        views: '18k',
        likes: '1.2k',
        comments: '280',
      },
      {
        title: 'Volunteer & Giving Back',
        description: 'Find opportunities to give back to the community and alma materFind opportunities to give back to the community and alma materFind opportunities to give back to the community and alma materFind opportunities to give back to the community and alma materFind opportunities to give back to the community and alma materFind opportunities to give back to the community and alma materFind opportunities to give back to the community and alma mater.',
        views: '20k',
        likes: '1k',
        comments: '320',
      },
    ];
  
    return (
      <>
        <div className="row" style={{ marginTop: "120px" }}>
          {/* Sidebar list (left section) */}
          <div className="col-2">
          Look at the Possibility Of Filtering
            <div className="bg-primary p-4 rounded shadow-sm">
              <h1 className="text-light mb-4">Popular Forums</h1>
              <ul className="list-unstyled">
                {forumData.map((forum, index) => (
                  <li key={index} className="my-3">
                    <a href="#" className="text-light text-decoration-none" style={{ fontWeight: "500", fontSize: "16px" }}>
                      {forum.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* Central posting input (middle section) */}
          <div className="col-7">
            <div className="d-flex align-items-center bg-dark p-3 rounded-2 mb-4 shadow-sm">
              <div className="bg-white rounded-circle profile d-flex justify-content-center align-items-center" style={{ height: "50px", width: "50px" }}>
                <h1 className="">P</h1>
              </div>
              <input
                className="p-2 me-3 ms-3 rounded-1 border-1"
                type="text"
                placeholder="Let’s share what’s on your mind..."
                style={{ flex: 1, border: "none", outline: "none" }}
              />
              <button className="rounded-3 p-2" style={{ backgroundColor: "#FF6934", color: "white", border: "none", fontWeight: "600" }}>Create Thread</button>
            </div>
  
            {/* Dynamic forum list (central section with cards) */}
            <div className="forum-list">
              {forumData.map((forum, index) => (
                <div key={index} className="d-flex bg-dark mb-3 p-3 rounded shadow-sm">
                  <div className="bg-primary rounded-3 d-flex justify-content-center align-items-center" style={{ width: "150px", height: "150px" }}>
                    <h1 className="text-light">P</h1>
                  </div>
                  <div className="text-light p-4" style={{ flex: 1 }}>
                    <h3 className="mb-2">{forum.title}</h3>
                    <p>{forum.description}</p>
                    <div className="text-light d-flex justify-content-between" style={{ fontSize: "14px" }}>
                      <span>{forum.views} Views</span>
                      <span>{forum.likes} Likes</span>
                      <span>{forum.comments} Comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Right-hand section */}
          <div className="col-3">
            <div className="bg-secondary p-4 rounded shadow-sm text-light">
              <h3>Related Forums</h3>
              <ul className="list-unstyled mt-3">
                <li className="my-2">
                  <a href="#" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: "500" }}>
                    Forum 1
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: "500" }}>
                    Forum 2
                  </a>
                </li>
                <li className="my-2">
                  <a href="#" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: "500" }}>
                    Forum 3
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };