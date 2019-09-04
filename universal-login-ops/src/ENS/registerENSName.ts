import ENSNameRegistrar from './ENSNameRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';

export const registerENSName = async (name: string, domain: string) => {
  const config = getConfig();
  const {provider} = connect('https://ropsten.infura.io', config.privateKey);
  const registrar = new ENSNameRegistrar(config, provider);
  await registrar.start(name, domain);
};
