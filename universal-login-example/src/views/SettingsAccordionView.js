import React from 'react';

const SettingsAccordionView = () => (
  <div>
    <div className="dropdown setting">
      <p>Adding and removing new accounts:</p>
      <button className="dropdown-btn setting-dropdown-btn">2 devices</button>
    </div>
    <div className="dropdown setting">
      <p>Other actions:</p>
      <button className="dropdown-btn setting-dropdown-btn">1 device</button>
    </div>
    <button className="btn fullwidth">Save new settings</button>
    <p className="click-cost">
      <em>Cost 2 klik</em>
    </p>
  </div>
);

export default SettingsAccordionView;
