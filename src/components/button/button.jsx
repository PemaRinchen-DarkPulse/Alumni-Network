import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export const PrevButton = ({ onClick, disabled }) => {
  return (
    <button
      className="btn btn-outline-primary"
      onClick={onClick}
      disabled={disabled}
    >
      &lt;
    </button>
  );
};

export const NextButton = ({ onClick, disabled }) => {
  return (
    <button
      className="btn btn-outline-primary rounded"
      onClick={onClick}
      disabled={disabled}
    >
      &gt;
    </button>
  );
};

export const MyDropdown = () => {
  return (
    <div className="dropdown">
      <Link to="/option1">Option 1</Link>
      <Link to="/option2">Option 2</Link>
      {/* Add more options as needed */}
    </div>
  );
};

