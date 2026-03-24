import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`glass-card p-6 ${hover ? 'glass-card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
