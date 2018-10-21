import ENSDeployer from '../lib/utils/ensDeployer';
import {jsonRpcUrl, ensRegistrars} from '../lib/config/relayer';

ENSDeployer.deploy(jsonRpcUrl, ensRegistrars, 'eth').catch(console.error);

