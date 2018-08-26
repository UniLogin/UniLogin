import React, { Component } from 'react';
import Login from './Login';
import CreatingId from './CreatingId';
import ApproveConnectionView from '../views/ApproveConnectionView';
import Greeting from './Greeting';
import Account from './Account';
import MainScreen from './MainScreen';
import PendingAuthorizations from './PendingAuthorizations';
import Backup from './Backup';
import Trusted from './Trusted';
import Example from './Example';
import PropTypes from 'prop-types';

class ContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Login'
    };
  }

  componentDidMount() {
    const {emitter} = this.props.services;
    this.subscription = emitter.addListener('setView', this.setView.bind(this));
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  setView(view) {
    this.setState({view});
  }

  render() {
    if (this.state.view === 'Login') {
      return <Login services={this.props.services} />;
    } else if (this.state.view === 'CreatingID') {
      return <CreatingId identityService={this.props.services.identityService}/>;
    } else if (this.state.view === 'Greeting') {
      return <Greeting identityService={this.props.services.identityService}/>;
    } else if (this.state.view === 'MainScreen') {
      return <MainScreen services={this.props.services}/>;
    } else if (this.state.view === 'Account') {
      return (<Account identityService={this.props.services.identityService}/>);
    } else if (this.state.view === 'ApproveConnection') {
      return <ApproveConnectionView setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'PendingAuthorizations') {
      return <PendingAuthorizations setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Backup') {
      return <Backup setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Trusted') {
      return <Trusted setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Example') {
      return <Example setView={this.setView.bind(this)}/>;
    }
  }
}

ContentContainer.propTypes = {
  services: PropTypes.object
};

export default ContentContainer;
