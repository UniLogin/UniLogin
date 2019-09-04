import DomainRegistrar from './DomainRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';

type RegisterTestDomainArgs = {
  nodeUrl: string;
  label : string;
}

export const registerTestDomain = async ({nodeUrl, label}: RegisterTestDomainArgs) => {
  const config = getConfig();
  const {provider} = connect(nodeUrl, config.privateKey);
  const registrar = new DomainRegistrar(config, provider);
  await registrar.registerAndSave(label, 'test');
};
