import React from 'react';

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
