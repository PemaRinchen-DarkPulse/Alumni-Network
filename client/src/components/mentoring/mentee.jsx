import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import './style.css';

const mentorList = [
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
  {
    id: 4,
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
  // Add more mentor data here
];

export const Mentee = () => {
  const [filters, setFilters] = useState({
    name: '',
    graduationYear: '',
    skills: ''
  });

  const handleFilterChange = (name, graduationYear, skills) => {
    setFilters({ name, graduationYear, skills });
  };

  const filteredMentors = mentorList.filter((mentor) => {
    const nameMatch = mentor.name.toLowerCase().includes(filters.name.toLowerCase());
    const yearMatch = filters.graduationYear ? mentor.graduationYear.toString() === filters.graduationYear : true;
    const skillsMatch = filters.skills ? mentor.skills.some(skill => skill.toLowerCase().includes(filters.skills.toLowerCase())) : true;

    return nameMatch && yearMatch && skillsMatch;
  });

  return (
    <div className="mentor-directory-container mb-5" style={{minHeight:"90vh"}}>
      <h1 className="mentor-directory-header" style={{ marginTop: "60px" }}>Find Mentor</h1>
      <UserFilter onFilter={handleFilterChange} />
      <div className="mentor-list">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <img src={mentor.profilePic} alt={mentor.name} className="mentor-profile-pic" />
              <div className="mentor-details">
                <h2>{mentor.name}</h2>
                <p className="mentor-graduation-year"><strong>Class of {mentor.graduationYear}</strong></p>
                <p className="mentor-degree">{mentor.degree}</p>
                <p className="mentor-bio">{mentor.bio}</p>
                <button className="mentor-connect-button">Connect</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'red', textAlign: 'center' }}>No match found.</p>
        )}
      </div>
    </div>
  );
};

export const UserFilter = ({ onFilter }) => {
  const [name, setName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [skills, setSkills] = useState('');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onFilter(newName, graduationYear, skills);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setGraduationYear(newYear);
    onFilter(name, newYear, skills);
  };

  const handleSkillsChange = (e) => {
    const newSkills = e.target.value;
    setSkills(newSkills);
    onFilter(name, graduationYear, newSkills);
  };

  return (
    <div className="filter-container p-4 bg-light rounded shadow-sm border-primary mb-4">
      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="mentorNameInput" className="text-start">Filter by Name</Label>
            <Input type="text" id="mentorNameInput" placeholder="Enter name" value={name} onChange={handleNameChange} />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="mentorYearSelect" className="text-start">Graduation Year</Label>
            <Input
              type="select"
              id="mentorYearSelect"
              value={graduationYear}
              onChange={handleYearChange}
            >
              <option value="" selected disabled>Select year</option>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="mentorSkillsSelect" className="text-start">Skills</Label>
            <Input
              type="select"
              id="mentorSkillsSelect"
              value={skills}
              onChange={handleSkillsChange}
            >
              <option value="">Select skills</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Project Management">Project Management</option>
              <option value="SEO">SEO</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};
