import ENSNameRegistrar from '../lib/utils/ENS/ENSNameRegistrar';
import config from '../lib/config/relayer';

const registrar = new ENSNameRegistrar(config);
registrar.start('justyna', 'super-domain.test');
