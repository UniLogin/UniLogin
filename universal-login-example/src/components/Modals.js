import React, { Component } from 'react';
import DevicesModal from '../views/Modals/DevicesModal';
import PostModal from '../views/Modals/PostModal';
import BackupModal from '../views/Modals/BackupModal';
import PropTypes from 'prop-types';

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

  componentDidMount() {
    this.props.emitter.addListener('showModal', modal => {
      this.showModal(modal);
    });
  }

  showModal(modal) {
    this.setState({ modal });
  }

  hideModal() {
    this.props.emitter.emit('showModal', null);
  }

  showAccount() {
    this.hideModal();
    this.props.emitter.emit('setView', 'Account');
  }

  async printScreen() {
    await this.hideModal();
    await window.print();
    this.showModal('backup');
  }

  render() {
    switch (this.state.modal) {
    case 'devices':
      return <DevicesModal hideModal={this.hideModal.bind(this)} />;
    case 'post':
      return <PostModal hideModal={this.hideModal.bind(this)} />;
    case 'backup':
      return <BackupModal printScreen={this.printScreen.bind(this)} showAccount={this.showAccount.bind(this)}/>;
    default:
      return null;
    }
  }
}

Modals.propTypes = {
  emitter: PropTypes.object
};

export default Modals;
