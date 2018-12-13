import DomainRegistrar from '../lib/utils/ENS/DomainRegistrar';
import config from '../lib/config/relayer';

const registrar = new DomainRegistrar(config);
registrar.start('my-domain', 'test');
