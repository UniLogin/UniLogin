import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo, raise} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {asBoolean, cast} from '@restless/sanitizers';
import {isLocalStorageBlocked, isPrivateMode, ThemeProvider} from '@unilogin/react';
import {asNetwork} from '../config';
import {render} from 'react-dom';
import React from 'react';
import {LocalStorageBlockedWarningScreen} from './react/warning/LocalStorageBlockedWarningScreen';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';
import {IncognitoModeWarningScreen} from './react/warning/IncognitoModeWarningScreen';

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;

  const endpoint = new IframeBridgeEndpoint();

  if (await isPrivateMode()) {
    endpoint.setIframeVisibility(true);
    await new Promise(resolve => render(
      <ThemeProvider theme="unilogin">
        <IncognitoModeWarningScreen onProceed={resolve}/>
      </ThemeProvider>
      , document.getElementById('root')));
  }

  if (isLocalStorageBlocked()) {
    endpoint.setIframeVisibility(true);
    render(
      <ThemeProvider theme="unilogin">
        <LocalStorageBlockedWarningScreen/>
      </ThemeProvider>
    , document.getElementById('root'));
    return;
  }

  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, applicationInfo, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()));

  await iframeInitializer.start();
}

main();
