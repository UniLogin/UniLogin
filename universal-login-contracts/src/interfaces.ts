import {utils} from 'ethers';
import WalletContract from '../contracts/Wallet.json';
import UpgradedWallet from '../contracts/UpgradedWallet.json';
import MockWalletMaster from '../contracts/MockWalletMaster.json';
import WalletProxyFactory from '../contracts/WalletProxyFactory.json';
import IERC20 from '../contracts/IERC20.json';
import WalletProxy from '../contracts/WalletProxy.json';

import FIFSRegistrar from '../contracts/FIFSRegistrar.json';
import PublicResolver from '../contracts/PublicResolver.json';
import ReverseRegistrar from '../contracts/ReverseRegistrar.json';
import ENS from '../contracts/ENS.json';

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
