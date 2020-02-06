import ENSRegistrar from './ENSRegistrar.json';
import GnosisSafe from './GnosisSafe.json';
import IProxy from './IProxy.json';
import ISignatureValidator from './ISignatureValidator.json';
import Proxy from './Proxy.json';
import ProxyFactory from './ProxyFactory.json';
import {Interface} from 'ethers/utils';

const interfaces = {
  ENSRegistrarInterface: new Interface(ENSRegistrar.interface as any),
  GnosisSafeInterface: new Interface(GnosisSafe.interface as any),
  IProxyInterface: new Interface(IProxy.interface as any),
  ISignatureValidatorInterface: new Interface(ISignatureValidator.interface as any),
  ProxyInterface: new Interface(Proxy.interface as any),
  ProxyFactoryInterface: new Interface(ProxyFactory.interface as any),
};

export {ENSRegistrar, GnosisSafe, IProxy, ISignatureValidator, Proxy, ProxyFactory, interfaces};
