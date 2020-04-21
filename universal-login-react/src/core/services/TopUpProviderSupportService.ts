import {Country} from '../models/Country';
import {TopUpProvider} from '../models/TopUpProvider';

export class TopUpProviderSupportService {
  constructor(private countries: Country[]) {
  }

  checkRampSupport(countryName: string): boolean {
    const country = this.countries.find(({name}) => name === countryName);
    return !!country && country.isEU;
  }

  checkSafelloSupport(countryName: string): boolean {
    return false;
  }

  checkWyreSupport(countryName: string): boolean {
    const wyreSupportedCountries = ['Australia', 'Austria', 'Belgium', 'Canada', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United States'];
    return wyreSupportedCountries.includes(countryName);
  }

  getProviders(countryName: string): TopUpProvider[] {
    const providers = [];
    this.checkRampSupport(countryName) && providers.push(TopUpProvider.RAMP);
    this.checkSafelloSupport(countryName) && providers.push(TopUpProvider.SAFELLO);
    this.checkWyreSupport(countryName) && providers.push(TopUpProvider.WYRE);
    return providers;
  }

  isInputAmountUsed(topUpProvider?: TopUpProvider) {
    return !!topUpProvider && [TopUpProvider.RAMP].includes(topUpProvider);
  }
}
