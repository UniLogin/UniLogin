import {utils} from 'ethers';

import {WalletContract, WalletProxyFactory, WalletProxy} from './beta2/contracts';
import {ENS, FIFSRegistrar, PublicResolver, ReverseRegistrar} from './ens';
import {IERC20} from './ierc20';

export const WalletContractInterface = new utils.Interface(WalletContract.interface as any);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface as any);
export const WalletProxyInterface = new utils.Interface(WalletProxy.interface as any);
export const IERC20Interface = new utils.Interface(IERC20.interface);
export const FIFSRegistrarInterface = new utils.Interface(FIFSRegistrar.interface);
export const ReverseRegistrarInterface = new utils.Interface(ReverseRegistrar.interface);
export const PublicResolverInterface = new utils.Interface(PublicResolver.interface);
export const ENSInterface = new utils.Interface(ENS.interface);
