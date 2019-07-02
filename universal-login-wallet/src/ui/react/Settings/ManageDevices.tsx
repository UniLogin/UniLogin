import React from 'react';
import Accordion from './Accordion';
import Phone from '../../assets/icons/phone.svg';

const ManageDevices = () => (
  <Accordion
    title="Manage devices"
    subtitle="You currently have 3 authorized devices"
    icon={Phone}
  >
    <div>Content</div>
  </Accordion>
);

export default ManageDevices;
