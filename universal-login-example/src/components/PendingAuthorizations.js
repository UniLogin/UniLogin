import React, { Component } from 'react';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import BackBtn from './BackBtn';
import PendingAuthorizationsView from '../views/PendingAuthorizationsView';
import PropTypes from 'prop-types';
import ProfileIdentity from './ProfileIdentity';

class PendingAuthorizations extends Component {

  constructor(props) {
    super(props);
    this.identityService = this.props.services.identityService;
    this.sdk = this.props.services.sdk;
    this.authorisationService = this.props.services.authorisationService;
    this.state = {authorisations: this.authorisationService.pendingAuthorisations};
  }

  componentDidMount() {
    const {address} = this.identityService.identity;
    this.setState({authorisations: this.authorisationService.pendingAuthorisations});
    this.authorisationService.subscribe(address, this.onAuthorisationChanged.bind(this));
  }

  componentWillUnmount() {
    //TODO: Unsubscribe
  }

  onAuthorisationChanged(authorisations) {
    this.setState({authorisations});
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
          <ProfileIdentity type="identityHeader" identityService={this.props.services.identityService}/>
          <RequestsBadge setView={this.props.setView} services={this.props.services}/>
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
