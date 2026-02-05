import { useState } from 'react';
import '../styles/Networking.css';

interface NetworkProfile {
  id: number;
  name: string;
  role: 'Teacher' | 'Alumni' | 'Student';
  batchYear?: string;
  company?: string;
  skills?: string[];
  gradientColor: string;
  profileImage?: string;
}

const Networking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [role, setRole] = useState('');

  // Sample data - replace with actual data from your backend
  const profiles: NetworkProfile[] = [
    {
      id: 1,
      name: 'Pema Rinchen',
      role: 'Teacher',
      gradientColor: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    },
    {
      id: 2,
      name: 'pemarinchen675@gmail.com',
      role: 'Alumni',
      batchYear: 'Batch 2022',
      gradientColor: 'linear-gradient(135deg, #00D9C0 0%, #00B4A6 100%)',
    },
    {
      id: 3,
      name: 'DrukWaste',
      role: 'Alumni',
      batchYear: 'Batch 2022',
      gradientColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'Alumni',
      batchYear: 'Batch 2020',
      company: 'Google',
      gradientColor: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    },
    {
      id: 5,
      name: 'Michael Chen',
      role: 'Teacher',
      gradientColor: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    },
    {
      id: 6,
      name: 'Emily Williams',
      role: 'Alumni',
      batchYear: 'Batch 2021',
      company: 'Apple',
      gradientColor: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    },
    {
      id: 7,
      name: 'David Martinez',
      role: 'Alumni',
      batchYear: 'Batch 2019',
      gradientColor: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      role: 'Teacher',
      gradientColor: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    },
    {
      id: 9,
      name: 'James Wilson',
      role: 'Alumni',
      batchYear: 'Batch 2023',
      gradientColor: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    },
  ];

  const handleSearch = () => {
    // Implement search logic here
    console.log('Search:', { searchQuery, batchYear, role });
  };

  return (
    <div className="networking-page">
      <div className="networking-header">
        <h1 className="networking-title">Campus Community</h1>
        <p className="networking-subtitle">
          Connect with peers, find mentors, and explore opportunities across the global alumni network.
        </p>
      </div>

      <div className="networking-search-section">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18.5 18.5l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={batchYear}
          onChange={(e) => setBatchYear(e.target.value)}
        >
          <option value="">Batch Year</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>

        <select
          className="filter-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Role</option>
          <option value="Alumni">Alumni</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="networking-grid">
        {profiles.map((profile) => (
          <div key={profile.id} className="network-card">
            <div 
              className="network-card-banner" 
              style={{ background: profile.gradientColor }}
            ></div>
            <div className="network-card-content">
              <div className="network-profile-image">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} />
                ) : (
                  <div className="profile-avatar">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="network-profile-name">{profile.name}</h3>
              <p className="network-profile-role">{profile.role}</p>
              {profile.batchYear && (
                <p className="network-profile-batch">{profile.batchYear}</p>
              )}
              {profile.company && (
                <p className="network-profile-company">{profile.company}</p>
              )}
              <button className="connect-button">Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Networking;
