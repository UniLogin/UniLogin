import React, {Component} from 'react';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import BackBtn from './BackBtn';
import PendingAuthorizationsView from '../views/PendingAuthorizationsView';
import PropTypes from 'prop-types';
import Profile from './Profile';
import {tokenContractAddress} from '../../config/config';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';

class PendingAuthorizations extends Component {
  constructor(props) {
    super(props);
    this.walletContractService = this.props.services.walletContractService;
    this.sdk = this.props.services.sdk;
    this.state = {
      authorisations: this.sdk.relayerObserver.lastAuthorisations
    };
  }

  componentDidMount() {
    const {address} = this.walletContractService.walletContract;
    this.setState({
      authorisations: this.sdk.relayerObserver.lastAuthorisations
    });
    this.subscription = this.sdk.subscribe(
      'AuthorisationsChanged',
      {contractAddress: address},
      this.onAuthorisationChanged.bind(this)
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  onAuthorisationChanged(authorisations) {
    const {emitter} = this.props.services;

    this.setState({authorisations});

    if (authorisations.length === 0) {
      emitter.emit('setView', 'MainScreen');
    }
  }

  async onAcceptClick(publicKey) {
    const {walletContractService} = this.props.services;
    const to = walletContractService.walletContract.address;
    const {privateKey} = walletContractService.walletContract;
    const {sdk} = walletContractService;
    const addKeyPaymentOptions = {
      ...DEFAULT_PAYMENT_OPTIONS,
      gasToken: tokenContractAddress
    };
    await sdk.addKey(to, publicKey, privateKey, addKeyPaymentOptions);
  }

  async onDenyClick(publicKey) {
    const {walletContractService} = this.props.services;
    const walletContractAddress = walletContractService.walletContract.address;
    const {sdk} = walletContractService;
    await sdk.denyRequest(walletContractAddress, publicKey);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <Profile
            type="walletContractHeader"
            walletContractService={this.props.services.walletContractService}
          />
          <RequestsBadge
            setView={this.props.setView}
            services={this.props.services}
          />
          <BackBtn setView={this.props.setView} />
        </HeaderView>
        <PendingAuthorizationsView
          setView={this.props.setView}
          authorisations={this.state.authorisations}
          onAcceptClick={this.onAcceptClick.bind(this)}
          onDenyClick={this.onDenyClick.bind(this)}
        />
      </div>
    );
  }
}

PendingAuthorizations.propTypes = {
  setView: PropTypes.func,
  services: PropTypes.object
};

export default PendingAuthorizations;
