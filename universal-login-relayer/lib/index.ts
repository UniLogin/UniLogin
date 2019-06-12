import Relayer, {RelayerClass} from './relayer';
export default Relayer;
import {config, Config} from './config/relayer';
export {RelayerClass, config};
export {DevelopmentRelayer} from './dev/DevelopmentRelayer';
export {TokenGrantingRelayer} from './dev/TokenGrantingRelayer';
export {RelayerUnderTest} from './utils/relayerUnderTest';
