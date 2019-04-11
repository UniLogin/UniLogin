import config from './config';

type NodeEnv = 'development' | 'test' | 'production';

const getNodeEnv = () => (process.env.NODE_ENV || 'development') as NodeEnv;

const getConfig = () => config[getNodeEnv()];

export default getConfig;
