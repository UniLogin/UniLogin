import React, { Component } from 'react';

class ManageDevicesAccordionView extends Component {

  renderDevices() {
    return this.props.devices.map( (item,i) =>{
      return (
        <li key={i} className="device">
          <p className="device-name">{item.name}</p>
          <p className="device-status">{item.name}</p>
          <button onClick={() => this.props.confirmAction()} className="device-btn"></button>
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

export default ManageDevicesAccordionView;