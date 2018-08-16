import React, { Component } from 'react';
import DevicesModal from '../views/Modals/DevicesModal';
import PostModal from '../views/Modals/PostModal';

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
        return <DevicesModal hideModal={this.hideModal.bind(this)}/>
        break;
      case 'post':
      return <PostModal hideModal={this.hideModal.bind(this)} />
        break;
      default:
        return null;
        break;
    }
  }
}

export default Modals;