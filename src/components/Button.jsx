import React from 'react';

const Button = ({ children, onClick, className = '', type = 'button', fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`primary-btn px-6 py-3 text-sm tracking-wide ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
