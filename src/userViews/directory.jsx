// src/App.js
import React, { useState } from 'react';
import './style.css';

const AlumniDirectory = () => {
  const initialAlumni = [
    { id: 1, name: 'Alice Johnson', age: 28 },
    { id: 2, name: 'Bob Smith', age: 30 },
    { id: 3, name: 'Charlie Brown', age: 25 },
    { id: 4, name: 'David Wilson', age: 35 },
    { id: 5, name: 'Eve Davis', age: 29 },
  ];

  const [alumni, setAlumni] = useState(initialAlumni);
  const [filter, setFilter] = useState('');

  const deleteAlumnus = (id) => {
    setAlumni(alumni.filter(alumnus => alumnus.id !== id));
  };

  const filteredAlumni = alumni.filter(alumnus =>
    alumnus.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Alumni Directory</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      <div className="alumni-grid">
        {filteredAlumni.map(alumnus => (
          <div key={alumnus.id} className="alumni-card">
            <div className="alumni-info">
              <span className="alumni-name">{alumnus.name}</span>
              <span className="alumni-age"> (Age: {alumnus.age})</span>
            </div>
            <div className="button-container">
              <button className="action-button">View Profile</button>
              <button className="action-button connect-button">Connect</button>
              <button className="delete-button" onClick={() => deleteAlumnus(alumnus.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return <AlumniDirectory />;
};

export default App;
