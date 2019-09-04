import DomainRegistrar from './DomainRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';


export const registerTestDomain = async (label : string) => {
  const config = getConfig();
  const {provider} = connect('https://ropsten.infura.io', config.privateKey);
  const registrar = new DomainRegistrar(config, provider);
  await registrar.registerAndSave(label, 'test');
};
