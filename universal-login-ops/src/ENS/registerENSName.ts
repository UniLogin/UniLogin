import ENSNameRegistrar from './ENSNameRegistrar';
import {connect} from '../cli/connectAndExecute';

type RegisterENSNameArgs = {
  nodeUrl: string;
  name: string;
  domain: string;
  privateKey: string;
  ensAddress: string;
  publicResolverAddress: string;
};

export const registerENSName = async ({name, domain, nodeUrl, privateKey, ensAddress, publicResolverAddress}: RegisterENSNameArgs) => {
  const {wallet} = connect(nodeUrl, privateKey);
  const registrar = new ENSNameRegistrar({ensAddress, publicResolverAddress}, wallet);
  await registrar.start(name, domain);
};
