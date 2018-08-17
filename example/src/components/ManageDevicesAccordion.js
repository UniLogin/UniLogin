import React, { Component } from 'react';
import Collapsible from './Collapsible';
import PhoneIco from '../img/smartphone.svg';
import ManageDevicesAccordionView from '../views/ManageDevicesAccordionView';

const devices = [
  {
    name: 'Safari on Mac OSX',
    status: 'The current device'
  },
  {
    name: 'Chrome on Windows',
    status: 'Last seen: a few minutes ago'
  },
  {
    name: 'Status app on iOS',
    status: 'Last seen: 8 days ago'
  }
]

class ManageDevices extends Component {
  confirmAction() {
    this.props.emitter.emit('showModal', 'devices');
  }
  
  render() {        
    
    
    return (
      <Collapsible
        title="Manage devices"
        subtitle="You currently have 3 authorized devices"
        icon={PhoneIco}
      >
        <ManageDevicesAccordionView devices={devices} confirmAction={this.confirmAction.bind(this)}/>
      </Collapsible>
    );
  }
}

export default ManageDevices;