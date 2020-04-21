import {Provider} from './models/provider';
import {Network} from './models/network';

export function normalizeUpstream(upstream: Provider | Network) {
  if (upstream === undefined) {
    throw new Error('Either a provider or a network name must be passed as a first argument');
  } else if (typeof upstream === 'string') {
    return {network: upstream.toString() as Network};
  }
  return {upstream};
}
