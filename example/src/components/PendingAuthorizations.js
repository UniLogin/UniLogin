import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import Requests from './Requests';
import LogoutBtn from './LogoutBtn';
import BackBtn from './BackBtn';
import PendingAuthorizationsView from '../views/PendingAuthorizationsView';
import PropTypes from 'prop-types';
import ProfileIdentity from './ProfileIdentity';

class PendingAuthorizations extends Component {

  constructor(props) {
    super(props);
    const {identityService} = this.props.services;
    this.identityService = identityService;
    const {authorisationService} = this.props.services;
    this.authorisationService = authorisationService;
    this.state = {authorisations: []};
  }

  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async update() {
    const pendingAuthorisations = await this.authorisationService.getPendingAuthorisations(this.identityService.identity.address);
    if (typeof(pendingAuthorisations) !== 'undefined') {
      if (pendingAuthorisations.length == this.state.authorisations.length) {
        setTimeout(this.update.bind(this), 1500);
        return;
      }
      if (pendingAuthorisations.length > 0) {
        this.setState({authorisations: pendingAuthorisations});
      } else {
        this.setState({authorisations: []});
      }
    }
    setTimeout(this.update.bind(this), 1500);
  }

  onAcceptClick(publicKey) {
    const {identityService} = this.props.services;
    const to = identityService.identity.address;
    const {privateKey} = identityService.identity;
    const {sdk} = identityService;
    sdk.addKey(to, publicKey, privateKey);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity type="identityHeader" identityService = {this.props.services.identityService}/>
          <Requests setView={this.props.setView} authorisationService = {this.props.services.authorisationService} identityService = {this.props.services.identityService}/>
          <LogoutBtn setView={this.props.setView} />
          <BackBtn setView={this.props.setView} />
        </HeaderView>
        <PendingAuthorizationsView setView={this.props.setView} authorisations={this.state.authorisations} onAcceptClick={this.onAcceptClick.bind(this)}/>
      </div>
    );
  }
}

PendingAuthorizations.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default PendingAuthorizations;
