import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';
import {EMPTY_LOGO} from '@universal-login/commons';

const applicationInfo = {applicationName: 'Embeded', logo: EMPTY_LOGO, type: 'laptop'}; // TODO: get from query
const iframeInitializer = window.location.search.includes('picker')
  ? new PickerIframeInitializer(applicationInfo)
  : new ProviderOnlyIframeInitializer();

iframeInitializer.start();
