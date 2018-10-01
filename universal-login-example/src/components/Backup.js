import React, { Component } from 'react';
import BackupView from '../views/BackupView';
import PropTypes from 'prop-types';

class Backup extends Component {
  render() {
  	const {identity} = this.props.identityService;
    return <BackupView identity={identity} setView={this.props.setView} />;
  }
}

Backup.propTypes = {
  setView: PropTypes.func
};

export default Backup;
