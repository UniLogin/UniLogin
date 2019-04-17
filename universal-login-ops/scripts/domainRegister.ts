import DomainRegistrar from '../src/ENS/DomainRegistrar';
import config from '../src/ENS/config';

if (process.argv.length === 4) {
  const registrar = new DomainRegistrar(config as any);
  registrar.registerAndSave(process.argv[2], process.argv[3]);
} else {
  console.log(`Syntax: yarn register:domain 'my-domain' 'test'`);
}
