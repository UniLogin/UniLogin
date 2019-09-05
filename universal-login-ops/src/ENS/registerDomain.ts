import DomainRegistrar from './DomainRegistrar';
import {connect} from '../cli/connectAndExecute';
import {utils} from 'ethers';

type RegisterTestDomainArgs = {
  nodeUrl: string;
  label: string;
  privateKey: string;
  ensAddress: string;
  publicResolverAddress: string;
};

type RegisterEthDomainArgs = {
  nodeUrl: string;
  label: string;
  privateKey: string;
  ensAddress: string;
  gasPrice?: string;
};

export const registerTestDomain = async ({nodeUrl, label, privateKey, ensAddress, publicResolverAddress}: RegisterTestDomainArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const registrar = new DomainRegistrar({ensAddress, publicResolverAddress}, wallet);
  await registrar.registerAndSave(label, 'test');
};

export const registerEthDomain = async ({nodeUrl, label, privateKey, ensAddress, gasPrice}: RegisterEthDomainArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const transactionOverrides = gasPrice ? {gasPrice: utils.bigNumberify(gasPrice)} : {};
  const registrar = new DomainRegistrar({ensAddress}, wallet, transactionOverrides);
  await registrar.registerEthDomain(label);
};
