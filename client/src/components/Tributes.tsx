import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateTribute from './CreateTribute';
import '../styles/Tributes.css';

interface Tribute {
  id: number;
  teacherName: string;
  department: string;
  years: string;
  quote: string;
  studentName: string;
  studentClass: string;
  likes: number;
  profileImage?: string;
}

const Tributes = () => {
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showCreateTribute, setShowCreateTribute] = useState(false);
  const { user } = useAuth();
  
  const isTeacher = user?.role?.toLowerCase() === 'teacher';

  if (showCreateTribute) {
    return <CreateTribute onClose={() => setShowCreateTribute(false)} />;
  }

  // Sample data - replace with actual data from your backend
  const tributes: Tribute[] = [
    {
      id: 1,
      teacherName: 'Mr. John Keating',
      department: 'ENGLISH DEPT.',
      years: '1968-1995',
      quote: '"He taught me to look at things in a different way. \'O Captain! My Captain!\' will forever echo in my mind. He didn\'t teach poetry; he taught us to seize the day and make our lives extraordinary."',
      studentName: 'Todd Anderson',
      studentClass: 'Class of \'89',
      likes: 124,
    },
    {
      id: 2,
      teacherName: 'Mrs. McGonagall',
      department: 'SCIENCE DEPT.',
      years: '1990-Present',
      quote: '"Stern but fair. She pushed me harder than any other teacher because she saw potential I didn\'t see in myself. I wouldn\'t be a scientist today without her unwavering belief in my abilities."',
      studentName: 'Hermione G.',
      studentClass: 'Class of \'98',
      likes: 89,
    },
    {
      id: 3,
      teacherName: 'Mr. George Feeny',
      department: 'HISTORY',
      years: '1985-2005',
      quote: '"Believe in yourselves. Dream. Try. Do good. Mr. Feeny was more than a history teacher; he was a life mentor. His lessons extended far beyond the classroom walls."',
      studentName: 'Cory Matthews',
      studentClass: 'Class of \'00',
      likes: 215,
    },
    {
      id: 4,
      teacherName: 'Ms. Jennifer Honey',
      department: 'PRIMARY ED.',
      years: '1996-2010',
      quote: '"She was the first teacher who made me feel safe. Her kindness was her superpower. In a world that often feels harsh, she created a haven of learning and love."',
      studentName: 'Matilda W.',
      studentClass: 'Class of \'02',
      likes: 156,
    },
    {
      id: 5,
      teacherName: 'Mr. Dewey Finn',
      department: 'MUSIC',
      years: '2003-2004',
      quote: '"He wasn\'t exactly conventional, but man, did he teach us how to rock! He showed us the power of music to unite us and give us confidence we never knew we had."',
      studentName: 'Zack M.',
      studentClass: 'Class of \'04',
      likes: 98,
    },
    {
      id: 6,
      teacherName: 'Prof. Charles Xavier',
      department: 'HEADMASTER',
      years: '1963-Present',
      quote: '"He gave us a home when the world turned its back. His dream of coexistence is something truly great. A true visionary who saw the best in all of us."',
      studentName: 'Scott S.',
      studentClass: 'Class of \'85',
      likes: 342,
    },
  ];

  const departments = ['All Departments', 'Science', 'Arts', 'Humanities', 'Sports'];

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

      {/* Tributes Grid */}
      <div className="tributes-grid">
        {tributes.map((tribute) => (
          <div key={tribute.id} className="tribute-card">
            <div className="tribute-header">
              <div className="tribute-profile">
                <div className="profile-image">
                  {tribute.profileImage ? (
                    <img src={tribute.profileImage} alt={tribute.teacherName} />
                  ) : (
                    <div className="profile-placeholder">
                      {tribute.teacherName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h3 className="teacher-name">{tribute.teacherName}</h3>
                  <p className="department">{tribute.department}</p>
                </div>
              </div>
              <span className="years">{tribute.years}</span>
            </div>

            <p className="tribute-quote">{tribute.quote}</p>

            <div className="tribute-footer">
              <div className="student-info">
                <p className="student-name">{tribute.studentName}</p>
                <p className="student-class">{tribute.studentClass}</p>
              </div>
              <button className="like-button">
                <span className="heart-icon">♡</span> {tribute.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tributes;
