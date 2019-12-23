import {utils} from 'ethers';
import WalletContract from '../dist/contracts/Wallet.json';
import UpgradedWallet from '../dist/contracts/UpgradedWallet.json';
import MockWalletMaster from '../dist/contracts/MockWalletMaster.json';
import WalletProxyFactory from '../dist/contracts/WalletProxyFactory.json';
import IERC20 from '../dist/contracts/IERC20.json';
import WalletProxy from '../dist/contracts/WalletProxy.json';

import {FIFSRegistrar, PublicResolver, ENS} from './ens';
import ReverseRegistrar from '../dist/contracts/ReverseRegistrar.json';

export const WalletContractInterface = new utils.Interface(WalletContract.interface);
export const UpgradedWalletInterface = new utils.Interface(UpgradedWallet.interface);
export const MockWalletMasterInterface = new utils.Interface(MockWalletMaster.interface);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface);
export const IERC20Interface = new utils.Interface(IERC20.interface);
export const FIFSRegistrarInterface = new utils.Interface(FIFSRegistrar.interface);
export const ReverseRegistrarInterface = new utils.Interface(ReverseRegistrar.interface);
export const PublicResolverInterface = new utils.Interface(PublicResolver.interface);
export const ENSInterface = new utils.Interface(ENS.interface);
export const WalletProxyInterface = new utils.Interface(WalletProxy.interface);
