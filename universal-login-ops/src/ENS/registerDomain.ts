import DomainRegistrar from './DomainRegistrar';
import getConfig from './config';

export const registerDomain = async (label : string, tld : string) => {
  const registrar = new DomainRegistrar(getConfig());
  await registrar.registerAndSave(label, tld);
}
