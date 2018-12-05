import React, {Component} from 'react';
import Connect from '../views/Connect';
import Transfer from '../views/Transfer';
import EthereumIdentitySDK from 'universal-login-sdk';
import {providers, Wallet, Contract} from 'ethers';
import Clicker from '../../abi/Clicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {view: 'connect'};
    this.provider = new providers.JsonRpcProvider('http://localhost:18545');
    this.sdk = new EthereumIdentitySDK('http://localhost:3311', this.provider);
    this.clickerContractAddress = '0x87bB498DA0C18af128180b761680fb47D6FB365d';
    this.tokenContractAddress = '';
    this.clickerContract = new Contract(
      this.clickerContractAddress,
      Clicker.interface,
      this.provider
    );
  }

  async update(event) {
    const {value} = event.target;
    this.setState({value});
  }

  onChange(event) {
    const {value} = event.target;
    this.setState({to: value});
  }

  async onTransferClick() {
    const message = {
      to: this.clickerContractAddress,
      from: this.identityAddress,
      value: 0,
      data: this.clickerContract.interface.functions.press().data,
      gasToken: this.tokenContractAddress,
      gasPrice: 110000000000000,
      gasLimit: 1000000

    };
    await this.sdk.execute(this.identityAddress, message, this.privateKey);
  }

  async onNextClick() {
    const name = `${this.state.value}.mylogin.eth`;
    const identityAddress = await this.sdk.identityExist(name);
    this.identityAddress = identityAddress;
    if (identityAddress) {
      const privateKey = await this.sdk.connect(identityAddress);
      this.privateKey = privateKey;
      this.state.view === 'transfer';
      const {address} = new Wallet(privateKey);
      this.subscription = this.sdk.subscribe('KeyAdded', identityAddress, (event) => {
        if (event.address === address) {
          this.setState({view: 'transfer'});
        }
      });
    } else {
      alert(`Identity ${name} does not exist.`);
    }
  }

  async componentDidMount() {
    if (await this.sdk.start()) {
      this.emitter.emit('setView', 'MainScreen');
    }
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.sdk.stop();
  }

  render() {
    if (this.state.view === 'connect') {
      return (<Connect onChange={this.update.bind(this)} onNextClick={this.onNextClick.bind(this)}/>);
    } if (this.state.view === 'transfer') {
      return (<Transfer onChange={this.onChange.bind(this)} onClick={this.onTransferClick.bind(this)}/>);
    }
  }
}


export default App;
