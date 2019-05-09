import DomainRegistrar from '../src/ENS/DomainRegistrar';
import getConfig from '../src/ENS/config';

if (process.argv.length === 4) {
  const registrar = new DomainRegistrar(getConfig());
  registrar.registerAndSave(process.argv[2], process.argv[3]);
} else {
  console.log(`Syntax: yarn register:domain 'my-domain' 'test'`);
}
