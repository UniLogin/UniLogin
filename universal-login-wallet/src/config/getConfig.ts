import config, {WalletConfig} from './config';

type NodeEnv = 'development' | 'test' | 'production';

const getNodeEnv = () => (process.env.NODE_ENV || 'development') as NodeEnv;

const getConfig = (): WalletConfig => config[getNodeEnv()];

export default getConfig;
