import ENSNameRegistrar from './ENSNameRegistrar';
import getConfig from './config';
import {connect} from '../cli/connectAndExecute';

type RegisterENSNameArgs = {
  nodeUrl: string;
  name: string;
  domain: string;
  privateKey: string;
}

export const registerENSName = async ({name, domain, nodeUrl, privateKey}: RegisterENSNameArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const config = getConfig();
  const registrar = new ENSNameRegistrar(config, wallet);
  await registrar.start(name, domain);
};
