import React from 'react';
import './Suspense.scss';

function SuspenseFallback() {
  return (
    <div className="spinner-container">
      <div className="loading-box">
        <div className="loader" />
      </div>
    </div>
  );
}

export default SuspenseFallback;
