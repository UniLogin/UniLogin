import config from './config.json';

const getNodeEnv = () => process.env.NODE_ENV || 'development';

const getConfig = () => config[`${getNodeEnv()}`];

export default getConfig;
