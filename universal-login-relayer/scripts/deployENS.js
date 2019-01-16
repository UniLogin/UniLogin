import ENSDeployer from '../lib/utils/ensDeployer';

const ensRegistrars = {'my-login.eth': [], 'universal-id.eth': [], 'poppularap.eth': []};
const jsonRpcUrl = 'http://localhost:18545';

ENSDeployer.deploy(jsonRpcUrl, ensRegistrars, 'eth').catch(console.error);

