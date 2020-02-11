import {utils} from 'ethers';
import WalletContract from './Wallet.json';
import WalletProxy from './WalletProxy.json';
import WalletProxyFactory from './WalletProxyFactory.json';

const interfaces = {
  WalletContractInterface: new utils.Interface(WalletContract.interface),
  WalletProxyInterface: new utils.Interface(WalletProxy.interface),
  WalletProxyFactoryInterface: new utils.Interface(WalletProxyFactory.interface),
};

export {WalletContract, WalletProxy, WalletProxyFactory, interfaces};
