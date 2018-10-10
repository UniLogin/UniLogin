import React, { Component } from 'react';
import DevicesModal from './DevicesModal';
import PostModal from '../views/Modals/PostModal';
import BackupModal from './BackupModal';
import PropTypes from 'prop-types';

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      modal: null,
      options: ''
    };
  }

  componentDidMount() {
    this.props.services.emitter.addListener('showModal', (modal, options) => {
      this.showModal(modal, options);
    });
  }

  showModal(modal, options='') {
    this.setState({ modal, options });
  }

  hideModal() {
    this.props.services.emitter.emit('showModal', null);
  }

  render() {
    switch (this.state.modal) {
    case 'devices':
      return <DevicesModal hideModal={this.hideModal.bind(this)} publicKey={this.state.options} services={this.props.services} />;
    case 'post':
      return <PostModal hideModal={this.hideModal.bind(this)} />;
    case 'backup':
      return <BackupModal emitter={this.props.services.emitter} />;
    default:
      return null;
    }
  }
}

Modals.propTypes = {
  services: PropTypes.objeect
};

export default Modals;
