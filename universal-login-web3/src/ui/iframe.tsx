import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';

const iframeInitializer = window.location.search.includes('picker')
  ? new PickerIframeInitializer()
  : new ProviderOnlyIframeInitializer();

iframeInitializer.start();
