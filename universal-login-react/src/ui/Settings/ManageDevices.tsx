import React from 'react';
import Accordion from './Accordion';

export const ManageDevices = () => (
  <Accordion
    title="Manage devices"
    subtitle="You currently have 3 authorized devices"
  >
    <div>
      <button className="settings-btn">Remove this device</button>
    </div>
  </Accordion>
);

export default ManageDevices;
