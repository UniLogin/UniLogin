import {ProviderOnlyIframeInitializer} from '../services/ProviderOnlyIframeInitializer';
import {PickerIframeInitializer} from '../services/PickerIframeInitializer';

if (window.location.search.includes('picker')) {
  const pickerIframeInitializer = new PickerIframeInitializer();
  pickerIframeInitializer.init();
} else {
  const providerOnlyIframeInitializer = new ProviderOnlyIframeInitializer();
  providerOnlyIframeInitializer.init()
}
