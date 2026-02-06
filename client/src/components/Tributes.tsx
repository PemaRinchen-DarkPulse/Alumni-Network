import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateTribute from './CreateTribute';
import tributeService from '../services/tributeService';
import type { Tribute } from '../services/tributeService';
import '../styles/Tributes.css';

const Tributes = () => {
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showCreateTribute, setShowCreateTribute] = useState(false);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const isTeacher = user?.role?.toLowerCase() === 'teacher';

  useEffect(() => {
    fetchTributes();
  }, [activeFilter, sortBy]);

  const fetchTributes = async () => {
    try {
      setLoading(true);
      setError('');
      
      let fetchedTributes: Tribute[] = [];
      
      if (activeFilter === 'All Departments') {
        fetchedTributes = await tributeService.getAllPublishedTributes();
      } else {
        fetchedTributes = await tributeService.getTributesByDepartment(activeFilter);
      }
      
      console.log('Fetched tributes:', fetchedTributes);
      
      // Sort tributes
      if (sortBy === 'Most Liked') {
        fetchedTributes.sort((a, b) => b.likeCount - a.likeCount);
      } else if (sortBy === 'Oldest First') {
        fetchedTributes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        // Most Recent (default)
        fetchedTributes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      setTributes(fetchedTributes);
    } catch (err: any) {
      console.error('Error fetching tributes:', err);
      console.error('Error response:', err.response);
      setError('Failed to load tributes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tributeId: number) => {
    try {
      const updatedTribute = await tributeService.likeTribute(tributeId);
      setTributes(prev => prev.map(t => t.id === tributeId ? updatedTribute : t));
    } catch (err) {
      console.error('Error liking tribute:', err);
    }
  };

  const handleTributeCreated = () => {
    setShowCreateTribute(false);
    fetchTributes(); // Refresh the list
  };

  if (showCreateTribute) {
    return <CreateTribute onClose={handleTributeCreated} />;
  }

  const departments = [
    'All Departments',
    'Science',
    'Mathematics',
    'English',
    'History',
    'Arts',
    'Music',
    'Physical Education',
    'Languages',
    'Computer Science',
    'Other'
  ];

  return (
    <div className="tributes-page">
      {/* Hero Section */}
      <div className="tributes-hero">
        <div className="tributes-hero-content">
          <span className="tributes-badge">COMMUNITY</span>
          {isTeacher ? (
            <>
              <h1 className="tributes-hero-title">
                See how you've impacted lives.
              </h1>
              <p className="tributes-hero-subtitle">
                Discover the heartfelt tributes from students whose lives you've<br />
                touched. Your dedication and passion have made a lasting difference.
              </p>
            </>
          ) : (
            <>
              <h1 className="tributes-hero-title">
                Honoring those who shaped our futures.
              </h1>
              <p className="tributes-hero-subtitle">
                A dedicated space to express gratitude to the mentors who made a<br />
                difference in our lives. Share your story today.
              </p>
              <button className="btn-write-tribute" onClick={() => setShowCreateTribute(true)}>
                <span className="icon">✏️</span> Write a Tribute
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="tributes-filters">
        <div className="filter-tabs">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-tab ${activeFilter === dept ? 'active' : ''}`}
              onClick={() => setActiveFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
        <div className="sort-dropdown">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Most Recent</option>
            <option>Most Liked</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="tributes-error">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="tributes-loading">
          <p>Loading tributes...</p>
        </div>
      ) : tributes.length === 0 ? (
        <div className="tributes-empty">
          <p>No published tributes found yet.</p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
            Tributes are reviewed before being published. Check back soon!
          </p>
        </div>
      ) : (
        /* Tributes Grid */
        <div className="tributes-grid">
          {tributes.map((tribute) => {
            const years = tribute.yearsFrom && tribute.yearsTo
              ? `${tribute.yearsFrom}-${tribute.yearsTo}`
              : tribute.yearsFrom || tribute.yearsTo || '';
            
            return (
              <div key={tribute.id} className="tribute-card">
                <div className="tribute-header">
                  <div className="tribute-profile">
                    <div className="profile-image">
                      <div className="profile-placeholder">
                        {tribute.teacherName.charAt(0)}
                      </div>
                    </div>
                    <div className="profile-info">
                      <h3 className="teacher-name">{tribute.teacherName}</h3>
                      <p className="department">{tribute.department?.toUpperCase() || tribute.subject?.toUpperCase()}</p>
                    </div>
                  </div>
                  {years && <span className="years">{years}</span>}
                </div>

                <p className="tribute-quote">"{tribute.message}"</p>

                <div className="tribute-footer">
                  <div className="student-info">
                    <p className="student-name">{tribute.authorName}</p>
                  </div>
                  <button 
                    className="like-button"
                    onClick={() => handleLike(tribute.id)}
                  >
                    <span className="heart-icon">♡</span> {tribute.likeCount}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tributes;