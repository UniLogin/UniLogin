import ENSNameRegistrar from '../lib/utils/ENS/ENSNameRegistrar';
import config from '../lib/config/ensRegistration';


if (process.argv.length === 4) {
  const registrar = new ENSNameRegistrar(config);
  registrar.start(process.argv[2], process.argv[3]);  
} else {
  console.log(`Syntax: yarn register:name 'name' 'my-domain.test'`);
}
