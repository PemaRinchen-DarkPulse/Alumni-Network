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
      <>
      <div className="row" style={{ marginTop: "120px" }}>
  <div className="col-2">
    <div className="bg-primary">
      <h1>Popular Forum</h1>
      <ul>
        <li><a href="">Frum 1</a></li>
        <li><a href="">Forum 2</a></li>
        <li><a href="">Forum 3</a></li>
        <li><a href="">Forum 4</a></li>
        <li><a href="">Forum 5</a></li>
      </ul>
    </div>
    <div className="bg-secondary">
      <h1>Popular Forum</h1>
      <ul>
        <li><a href="">Frum 1</a></li>
        <li><a href="">Forum 2</a></li>
        <li><a href="">Forum 3</a></li>
        <li><a href="">Forum 4</a></li>
        <li><a href="">Forum 5</a></li>
      </ul>
    </div>
    <div className="bg-dark rounded-5">
      <h5>Popular Forum</h5>
      <ul>
        <li><a href="">Frum 1</a></li>
        <li><a href="">Forum 2</a></li>
        <li><a href="">Forum 3</a></li>
        <li><a href="">Forum 4</a></li>
        <li><a href="">Forum 5</a></li>
      </ul>
    </div>
  </div>

  <div className="col-7">
    <div className="d-flex align-items-center bg-dark p-3 rounded-2">
      <div className="bg-primary rounded-circle profile" style={{ height: "50px", width: "50px" }}>
        <h1 className='text-center'>P</h1>
      </div>
      <input className="p-2 me-3 ms-3 rounded-1 border-1" type="text"
        placeholder="Let’s sha5re what’s going on your mind..."
        style={{ flex: 1 }}
      />
      <button className="rounded-3 p-2" style={{backgroundColor:"#FF6934"}}>Create Thread</button>
    </div>
  </div>

  <div className="col-3">
    pasdnas,md
  </div>
</div>

      </>
    );
  };
