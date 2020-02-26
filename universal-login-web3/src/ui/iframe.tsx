import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo, raise} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {asBoolean, cast} from '@restless/sanitizers';
import {isLocalStorageBlocked, isPrivateMode} from '@unilogin/react';
import {asNetwork} from '../config';

const parsedQuery = parseQuery(window.location.search);
const isPicker = cast(parsedQuery.picker, asBoolean);
const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);
const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;

async function main() {
  if (await isPrivateMode()) {
    alert('Warning! Please do not use incognito mode. You can lose all your funds.');
  }
  if (isLocalStorageBlocked()) {
    alert('Warning! Your browser is blocking access to the local storage. Please disable the protection and reload the page for UniLogin to work properly.');
  }

  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(applicationInfo, network)
    : new ProviderOnlyIframeInitializer(network ?? raise(new TypeError()));

  await iframeInitializer.start();
}

main();
