import ENSNameRegistrar from './ENSNameRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';

type RegisterENSNameArgs = {
  nodeUrl: string;
  name: string;
  domain: string;
}

export const registerENSName = async ({name, domain, nodeUrl}: RegisterENSNameArgs) => {
  const config = getConfig();
  const {provider} = connect(nodeUrl, config.privateKey);
  const registrar = new ENSNameRegistrar(config, provider);
  await registrar.start(name, domain);
};
