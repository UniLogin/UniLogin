import React, {Component} from 'react';
import DevicesModal from '../views/Modals/DevicesModal';
import PostModal from '../views/Modals/PostModal';
import BackupModal from './BackupModal';
import PropTypes from 'prop-types';

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {modal: null};
  }

  componentDidMount() {
    this.props.emitter.addListener('showModal', (modal) => {
      this.showModal(modal);
    });
  }

  showModal(modal) {
    this.setState({modal});
  }

  hideModal() {
    this.props.emitter.emit('showModal', null);
  }

  render() {
    switch (this.state.modal) {
      case 'devices':
        return <DevicesModal hideModal={this.hideModal.bind(this)} />;
      case 'post':
        return <PostModal hideModal={this.hideModal.bind(this)} />;
      case 'backup':
        return <BackupModal emitter={this.props.emitter} />;
      default:
        return null;
    }
  }
}

Modals.propTypes = {
  emitter: PropTypes.object
};

export default Modals;
