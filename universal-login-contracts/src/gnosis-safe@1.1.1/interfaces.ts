import {utils} from 'ethers';
import GnosisSafe from './contracts/GnosisSafe.json';
import ProxyFactory from './contracts/ProxyFactory.json';
import ProxyContract from './contracts/Proxy.json';
import IProxy from './contracts/IProxy.json';
import ISignatureValidator from './contracts/ISignatureValidator.json';

export const GnosisSafeInterface = new utils.Interface(GnosisSafe.interface);
export const ProxyFactoryInterface = new utils.Interface(ProxyFactory.interface);
export const ProxyInterface = new utils.Interface(ProxyContract.interface);
export const IProxyInterface = new utils.Interface(IProxy.interface);
export const ISignatureValidatorInterface = new utils.Interface(ISignatureValidator.interface as any);
