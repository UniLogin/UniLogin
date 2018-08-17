import React, { Component } from 'react';
import BackupView from '../views/BackupView';

class Backup extends Component {
  
  render() {
    return (
      <BackupView setView={this.props.setView}/>
    );
  }
}

export default Backup;