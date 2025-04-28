import React from 'react';
import './LoadingModal.css';

const LoadingModal: React.FC = () => (
  <div className="loading-backdrop">
    <div className="loading-modal">
      <div className="spinner" />
    </div>
  </div>
);

export default LoadingModal;