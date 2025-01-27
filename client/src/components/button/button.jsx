import React from 'react';
import { Link } from 'react-router-dom';
export const PrevButton = ({ onClick, disabled }) => {
  return (
    <button
      className="btn btn-outline-primary d-none d-md-block"
      onClick={onClick}
      disabled={disabled}
    >
      &lt;
    </button>
  );
};

export const NextButton = ({ onClick, disabled }) => {
  return (
    <button className="btn btn-outline-primary rounded d-none d-md-block" onClick={onClick} disabled={disabled}>
      &gt;
    </button>
  );
};

export const MyDropdown = () => {
  return (
    <div className="dropdown">
      <Link to="/option1">Option 1</Link>
      <Link to="/option2">Option 2</Link>
    </div>
  );
};

