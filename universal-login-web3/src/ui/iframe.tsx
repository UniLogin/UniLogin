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
  await checkPrivateSetting();

  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(applicationInfo, network)
    : new ProviderOnlyIframeInitializer(network ?? raise(new TypeError()));

  await iframeInitializer.start();
}

async function checkPrivateSetting() {
  const isPrivateModeWarning = await isPrivateMode() && 'Please do not use incognito mode. You can lose all your funds. ';
  const isLocalStorageBlockedWarning = isLocalStorageBlocked() && 'Your browser is blocking access to the local storage. Please disable the protection and reload the page for UniLogin to work properly. '

  if (isPrivateModeWarning || isLocalStorageBlockedWarning) {
    alert(`Warning! ${isPrivateModeWarning}${isLocalStorageBlockedWarning}`);
  }
}

main();
