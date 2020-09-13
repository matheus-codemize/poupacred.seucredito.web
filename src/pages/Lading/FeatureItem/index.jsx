import React from 'react';

import './styles.css';
function FeatureItem({ icon, title, children }) {
  return (
    <div className="feature-item">
      <i className={`fa ${icon}`} aria-hidden="true" />
      <span className="title">{title}</span>
      <p>{children}</p>
    </div>
  );
}

export default FeatureItem;
