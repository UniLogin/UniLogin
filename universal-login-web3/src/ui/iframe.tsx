import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo, raise} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {asBoolean, cast} from '@restless/sanitizers';
import {alertPrivateSettings, isLocalStorageBlocked, isPrivateMode} from '@unilogin/react';
import {asNetwork} from '../config';

const parsedQuery = parseQuery(window.location.search);
const isPicker = cast(parsedQuery.picker, asBoolean);
const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);
const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;

async function main() {
  alertPrivateSettings(await isPrivateMode(), isLocalStorageBlocked());

  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(applicationInfo, network)
    : new ProviderOnlyIframeInitializer(network ?? raise(new TypeError()));

  await iframeInitializer.start();
}

main();
