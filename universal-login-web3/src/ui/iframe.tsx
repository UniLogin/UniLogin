import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo, raise} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {asBoolean, cast} from '@restless/sanitizers';
import {asNetwork} from '../config';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;

  const endpoint = new IframeBridgeEndpoint();
  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, applicationInfo, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()));

  await iframeInitializer.start();
}

main();
