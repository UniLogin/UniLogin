import DomainRegistrar from './DomainRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';

type RegisterTestDomainArgs = {
  nodeUrl: string;
  label: string;
  privateKey: string;
}

export const registerTestDomain = async ({nodeUrl, label, privateKey}: RegisterTestDomainArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const config = getConfig();
  const registrar = new DomainRegistrar(config, wallet);
  await registrar.registerAndSave(label, 'test');
};
