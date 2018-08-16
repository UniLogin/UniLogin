import React, { Component } from 'react';

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

class DevicesList extends Component {

  confirmAction() {
    this.props.emitter.emit('showModal', 'devices');
  }
  
  renderDevices() {
    return devices.map( (item,i) =>{
      return (
        <li key={i} className="device">
          <p className="device-name">{item.name}</p>
          <p className="device-status">{item.name}</p>
          <button onClick={this.confirmAction.bind(this)} className="device-btn"></button>
        </li>
      )
    })
  }
  
  render() {
    return (
      <ul className="devices-list">
        {this.renderDevices()}
      </ul>
    );
  }
}

export default DevicesList;