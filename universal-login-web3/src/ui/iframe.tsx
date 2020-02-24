import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {cast} from '@restless/sanitizers';
import {isLocalStorageBlocked, isPrivateMode} from '@unilogin/react';

const parsedQuery = parseQuery(window.location.search);
const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);

async function main() {
  if (await isPrivateMode()) {
    alert('Warning! Please do not use incognito mode. You can lose all your funds.');
  }
  if (isLocalStorageBlocked()) {
    alert('Warning! Your browser is blocking access to the local storage. Please disable the protection and reload the page for UniLogin to work properly.');
  }

  const iframeInitializer = parsedQuery.picker === 'true'
    ? new PickerIframeInitializer(applicationInfo)
    : new ProviderOnlyIframeInitializer();

  await iframeInitializer.start();
}

main();

