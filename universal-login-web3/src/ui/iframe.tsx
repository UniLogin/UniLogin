import {asBoolean, cast, asArray} from '@restless/sanitizers';
import {raise, asNetwork, asApplicationInfo, asDialogsToDisable} from '@unilogin/commons';
import {asSdkConfigOverrides, SdkConfig} from '@unilogin/sdk';
import {parseQuery} from '@unilogin/react';
import {MissingParameter} from './utils/errors';
import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {IframeBridgeEndpoint} from '../services/IframeBridgeEndpoint';

const getSdkConfig = (applicationInfo?: string, sdkConfig?: string): Partial<SdkConfig> => {
  if (applicationInfo) {
    return {applicationInfo: cast(JSON.parse(applicationInfo), asApplicationInfo)};
  } else {
    if (!sdkConfig) throw new MissingParameter('sdkConfig');
    return cast(JSON.parse(sdkConfig), asSdkConfigOverrides);
  };
};

async function main() {
  const parsedQuery = parseQuery(window.location.search);
  const disabledDialogs = (parsedQuery.disabledDialogs ? cast(parsedQuery.disabledDialogs.split(','), asArray(asDialogsToDisable)) : []) as string[];
  const isPicker = cast(parsedQuery.picker, asBoolean);
  const network = parsedQuery.network ? cast(parsedQuery.network, asNetwork) : undefined;
  const sdkConfig = getSdkConfig(parsedQuery.applicationInfo, parsedQuery.sdkConfig);
  const endpoint = new IframeBridgeEndpoint();
  const iframeInitializer = isPicker
    ? new PickerIframeInitializer(endpoint, sdkConfig, disabledDialogs, network)
    : new ProviderOnlyIframeInitializer(endpoint, network ?? raise(new TypeError()), disabledDialogs, sdkConfig);

  await iframeInitializer.start();
}

main();
