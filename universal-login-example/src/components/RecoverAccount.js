import RecoverAccountView from '../views/RecoverAccountView';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Wallet} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';
import {tokenContractAddress} from '../../config/config';
import {fromBrainWallet} from '../utils';

class RecoverAccount extends Component {
  constructor(props) {
    super(props);
    this.sdk = this.props.services.sdk;
    this.walletContractService = this.props.services.walletContractService;
    this.emitter = this.props.services.emitter;
    this.state = {
      backupCode: '',
      isLoading: false,
      message: ''
    };
  }

  async componentDidMount() {
    await this.walletContractService.recover();
  }

  async onCancelClick() {
    const {emitter} = this.props.services;
    emitter.emit('setView', 'Login');
    this.walletContractService.cancelSubscription();

    const {walletContractService} = this.props.services;
    const walletContractAddress = walletContractService.walletContract.address;
    const {address} = new Wallet(walletContractService.privateKey);
    const {sdk} = walletContractService;
    await sdk.denyRequest(walletContractAddress, address);
  }

  async onRecoverClick() {
    this.setState({isLoading: true, message: ''});
    const {walletContractService, sdk} = this.props.services;
    const wallet = await fromBrainWallet(this.walletContractService.walletContract.name, this.state.backupCode);
    const addKeysPaymentOptions = {...DEFAULT_PAYMENT_OPTIONS, gasToken: tokenContractAddress};
    try {
      await sdk.addKey(walletContractService.walletContract.address, walletContractService.deviceAddress, wallet.privateKey, addKeysPaymentOptions);
    } catch (error) {
      this.setState({isLoading: false, message: 'Incorrect backup code, please retry'});
    }
  }

  onChange(event) {
    this.setState({backupCode: event.target.value});
  }

  setView(view) {
    this.emitter.emit('setView', view);
  }

  render() {
    return (<RecoverAccountView
      message={this.state.message}
      isLoading={this.state.isLoading}
      onChange={this.onChange.bind(this)}
      onCancelClick={this.onCancelClick.bind(this)}
      onRecoverClick={this.onRecoverClick.bind(this)}
      walletContract={this.walletContractService.walletContract}
    />);
  }
}

RecoverAccount.propTypes = {
  services: PropTypes.object
};

export default RecoverAccount;
