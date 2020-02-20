import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {asApplicationInfo} from '@unilogin/commons';
import {parseQuery} from './utils/parseQuery';
import {cast} from '@restless/sanitizers';

const parsedQuery = parseQuery(window.location.search);
const applicationInfo = cast(JSON.parse(parsedQuery.applicationInfo), asApplicationInfo);

const iframeInitializer = parsedQuery.picker === 'true'
  ? new PickerIframeInitializer(applicationInfo)
  : new ProviderOnlyIframeInitializer();

iframeInitializer.start();
