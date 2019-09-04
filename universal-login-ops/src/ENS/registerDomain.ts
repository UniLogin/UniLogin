import DomainRegistrar from './DomainRegistrar';
import getConfig from './config';

export const registerTestDomain = async (label : string) => {
  const registrar = new DomainRegistrar(getConfig());
  await registrar.registerAndSave(label, 'test');
};
