import React, {Component} from 'react';
import Collapsible from './Collapsible';
import ManageDevicesAccordionView from '../views/ManageDevicesAccordionView';
import PropTypes from 'prop-types';

const devices = [
  // {
  //   name: 'Mockup device',
  //   status: 'Feature not ye'
  // },
  // {
  //   name: 'Chrome on Windows',
  //   status: 'Last seen: a few minutes ago'
  // },
  // {
  //   name: 'Status app on iOS',
  //   status: 'Last seen: 8 days ago'
  // }
];

class ManageDevices extends Component {
  removeDevice() {
    if (
      confirm(
        'If you don\'t have other working devices or recovery options, you will lose access to this account permanently. Costs 1 click'
      )
    ) {
      // TODO: actually key from the contract
    }
  }

  render() {
    return (
      <Collapsible
        title="Manage devices"
        subtitle="You currently have 3 authorized devices"
        icon="icon-smartphone"
      >
        <ManageDevicesAccordionView
          devices={devices}
          removeDevice={this.removeDevice.bind(this)}
          onDisconnectClick={this.props.onDisconnectClick.bind(this)}
        />
      </Collapsible>
    );
  }
}

ManageDevices.propTypes = {
  onDisconnectClick: PropTypes.func
};

export default ManageDevices;
