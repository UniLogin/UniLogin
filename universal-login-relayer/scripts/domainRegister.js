import DomainRegistrar from '../lib/utils/ENS/DomainRegistrar';
import config from '../lib/config/relayer';

if (process.argv.length === 4) {
  const registrar = new DomainRegistrar(config);
  registrar.start(process.argv[2], process.argv[3]);  
} else {
  console.log(`Syntax: yarn register:domain 'my-domain' 'test'`);
}
