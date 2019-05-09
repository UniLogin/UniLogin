import ENSNameRegistrar from '../src/ENS/ENSNameRegistrar';
import getConfig from '../src/ENS/config';

if (process.argv.length === 4) {
  const registrar = new ENSNameRegistrar(getConfig());
  registrar.start(process.argv[2], process.argv[3]);
} else {
  console.log(`Syntax: yarn register:name 'name' 'my-domain.test'`);
}
