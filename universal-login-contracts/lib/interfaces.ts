import {utils} from 'ethers';
import WalletContract from '../build/Wallet.json';
import UpgradedWallet from '../build/UpgradedWallet.json';
import MockWalletMaster from '../build/MockWalletMaster.json';
import WalletProxyFactory from '../build/WalletProxyFactory.json';
import IERC20 from '../build/IERC20.json';

export const WalletContractInterface = new utils.Interface(WalletContract.interface);
export const UpgradedWalletInterface = new utils.Interface(UpgradedWallet.interface);
export const MockWalletMasterInterface = new utils.Interface(MockWalletMaster.interface);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface);
export const IERC20Interface = new utils.Interface(IERC20.interface);
