import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import '../styles/Networking.css';

interface NetworkProfile {
  id: number;
  name: string;
  role: string;
  batch?: string;
  email: string;
  gradientColor: string;
}

const Networking = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [role, setRole] = useState('');
  const [profiles, setProfiles] = useState<NetworkProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const gradientColors = [
    'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    'linear-gradient(135deg, #00D9C0 0%, #00B4A6 100%)',
    'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters: any = {};
      if (user?.email) {
        filters.currentUserEmail = user.email;
      }
      
      const response = await userService.getAllUsers(filters);
      
      if (response.success && response.data) {
        const users: NetworkProfile[] = response.data.map((user: any, index: number) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          batch: user.batch,
          gradientColor: gradientColors[index % gradientColors.length]
        }));
        setProfiles(users);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters: any = {};
      if (user?.email) filters.currentUserEmail = user.email;
      if (role) filters.role = role;
      if (batchYear) filters.batch = batchYear;
      if (searchQuery) filters.search = searchQuery;

      const response = await userService.getAllUsers(filters);
      
      if (response.success && response.data) {
        const users: NetworkProfile[] = response.data.map((user: any, index: number) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          batch: user.batch,
          gradientColor: gradientColors[index % gradientColors.length]
        }));
        setProfiles(users);
      }
    } catch (err: any) {
      console.error('Error searching users:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year.toString()}>{year}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Role</option>
          <option value="ALUMNI">Alumni</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="networking-grid">
          {profiles.map((profile) => (
            <div key={profile.id} className="network-card">
              <div 
                className="network-card-banner" 
                style={{ background: profile.gradientColor }}
              ></div>
              <div className="network-card-content">
                <div className="network-profile-image">
                  <div className="profile-avatar">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="network-profile-name">{profile.name}</h3>
                <p className="network-profile-role">{profile.role}</p>
                {profile.batch && (
                  <p className="network-profile-batch">Batch {profile.batch}</p>
                )}
                <button className="connect-button">Connect</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Networking;
