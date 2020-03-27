import {utils} from 'ethers';
import ENSRegistrar from './ENSRegistrar.json';
import GnosisSafe from './GnosisSafe.json';
import IProxy from './IProxy.json';
import ISignatureValidator from './ISignatureValidator.json';
import Proxy from './Proxy.json';
import ProxyFactory from './ProxyFactory.json';
import DefaultCallbackHandler from './DefaultCallbackHandler.json';

const interfaces = {
  ENSRegistrarInterface: new utils.Interface(ENSRegistrar.interface as any),
  GnosisSafeInterface: new utils.Interface(GnosisSafe.interface as any),
  IProxyInterface: new utils.Interface(IProxy.interface as any),
  ISignatureValidatorInterface: new utils.Interface(ISignatureValidator.interface as any),
  ProxyInterface: new utils.Interface(Proxy.interface as any),
  ProxyFactoryInterface: new utils.Interface(ProxyFactory.interface as any),
  DefaultCallbackHandler: new utils.Interface(DefaultCallbackHandler.interface as any),
};

export {ENSRegistrar, GnosisSafe, IProxy, ISignatureValidator, Proxy, ProxyFactory, interfaces, DefaultCallbackHandler};
