import {Interface} from 'ethers/utils';
import WalletContract from './Wallet.json';
import WalletProxy from './WalletProxy.json';
import WalletProxyFactory from './WalletProxyFactory.json';

const interfaces = {
  WalletContractInterface: new Interface(WalletContract.interface),
  WalletProxyInterface: new Interface(WalletProxy.interface),
  WalletProxyFactoryInterface: new Interface(WalletProxyFactory.interface),
};

export {WalletContract, WalletProxy, WalletProxyFactory, interfaces};
