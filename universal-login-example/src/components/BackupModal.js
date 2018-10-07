import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BackupModalView from '../views/BackupModalView';

class BackupModal extends Component {

  constructor(props) {
    super(props);
  }

  showAccount() {
    this.props.emitter.emit('showModal', null);
    this.props.emitter.emit('setView', 'Account');
  }

  async printScreen() {
    await this.props.emitter.emit('showModal', null);
    await window.print();
    this.props.emitter.emit('showModal', 'backup');
  }

  render() {
    return (
      <BackupModalView printScreen={this.printScreen.bind(this)} showAccount={this.showAccount.bind(this)} />
    );
  }
}

BackupModal.propTypes = {
  emitter: PropTypes.object
};

export default BackupModal;
