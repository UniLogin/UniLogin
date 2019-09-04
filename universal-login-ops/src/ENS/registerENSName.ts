import ENSNameRegistrar from './ENSNameRegistrar';
import getConfig from './config';

export const registerENSName = async (name: string, domain: string) => {
  const registrar = new ENSNameRegistrar(getConfig());
  await registrar.start(name, domain);
};
