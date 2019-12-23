import {utils} from 'ethers';
import WalletContract from '../../dist/contracts/Wallet.json';
import UpgradedWallet from '../../dist/contracts/UpgradedWallet.json';
import MockWalletMaster from '../../dist/contracts/MockWalletMaster.json';
import WalletProxyFactory from '../../dist/contracts/WalletProxyFactory.json';
import IERC20 from '../../dist/contracts/IERC20.json';
import WalletProxy from '../../dist/contracts/WalletProxy.json';

import FIFSRegistrar from '../../dist/contracts/FIFSRegistrar.json';
import PublicResolver from '../../dist/contracts/PublicResolver.json';
import ReverseRegistrar from '../../dist/contracts/ReverseRegistrar.json';
import ENS from '../../dist/contracts/ENS.json';

export const WalletContractInterface = new utils.Interface(WalletContract.interface as any);
export const UpgradedWalletInterface = new utils.Interface(UpgradedWallet.interface as any);
export const MockWalletMasterInterface = new utils.Interface(MockWalletMaster.interface as any);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface as any);
export const IERC20Interface = new utils.Interface(IERC20.interface as any);
export const FIFSRegistrarInterface = new utils.Interface(FIFSRegistrar.interface as any);
export const ReverseRegistrarInterface = new utils.Interface(ReverseRegistrar.interface as any);
export const PublicResolverInterface = new utils.Interface(PublicResolver.interface as any);
export const ENSInterface = new utils.Interface(ENS.interface as any);
export const WalletProxyInterface = new utils.Interface(WalletProxy.interface as any);
