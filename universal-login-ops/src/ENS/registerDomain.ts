import DomainRegistrar from './DomainRegistrar';
import {connect} from '../cli/connectAndExecute';

type RegisterTestDomainArgs = {
  nodeUrl: string;
  label: string;
  privateKey: string;
  ensAddress: string;
  publicResolverAddress: string;
};

export const registerTestDomain = async ({nodeUrl, label, privateKey, ensAddress, publicResolverAddress}: RegisterTestDomainArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const registrar = new DomainRegistrar({ensAddress, publicResolverAddress}, wallet);
  await registrar.registerAndSave(label, 'test');
};
