import ENSNameRegistrar from '../src/ENS/ENSNameRegistrar';
import config from '../src/ENS/config';


if (process.argv.length === 4) {
  const registrar = new ENSNameRegistrar(config as any);
  registrar.start(process.argv[2], process.argv[3]);
} else {
  console.log(`Syntax: yarn register:name 'name' 'my-domain.test'`);
}
