import ENSNameRegistrar from './ENSNameRegistrar';
import {connect} from '../cli/connectAndExecute';

type RegisterENSNameArgs = {
  nodeUrl: string;
  name: string;
  domain: string;
  privateKey: string;
  ensAddress: string;
};

export const registerENSName = async ({name, domain, nodeUrl, privateKey, ensAddress}: RegisterENSNameArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const registrar = new ENSNameRegistrar({ensAddress}, wallet);
  await registrar.start(name, domain);
};
