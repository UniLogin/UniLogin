import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ManageDevicesAccordionView extends Component {
  renderDevices() {
    return this.props.devices.map((item, index) => (
      <li key={index} className="device">
        <p className="device-name">{item.name}</p>
        <p className="device-status">{item.name}</p>
        <button
          onClick={() => this.props.removeDevice()}
          className="device-btn icon-minus-circle"
        />
      </li>
    ));
  }

  render() {
    return (
      <ul className="devices-list">
        <li key="this" className="device">
          <p className="device-name">The current device</p>
          <p className="device-status">Click to remove the key permanently</p>
          <button
            onClick={() => this.props.onDisconnectClick()}
            className="device-btn icon-minus-circle"
          />
        </li>

        {this.renderDevices()}
      </ul>
    );
  }
}

ManageDevicesAccordionView.propTypes = {
  devices: PropTypes.array,
  removeDevice: PropTypes.func,
  onDisconnectClick: PropTypes.func
};

export default ManageDevicesAccordionView;
