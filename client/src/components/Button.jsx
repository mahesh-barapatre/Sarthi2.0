import React from 'react';

const Button = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
      {children}
    </button>
  );
};

export default Button;
