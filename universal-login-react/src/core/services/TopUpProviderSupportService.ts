import {Country} from '../models/Country';
import {TopUpProvider} from '../models/TopUpProvider';

export class TopUpProviderSupportService {
  constructor(private countries: Country[]) {
  }

  checkRampSupport(countryName: string): boolean {
    return countryName === 'United Kingdom';
  }

  checkSafelloSupport(countryName: string): boolean {
    const country = this.countries.find(({name}) => name === countryName);
    return !!country && country.isEU;
  }

  checkWyreSupport(countryName: string): boolean {
    return countryName === 'United States';
  }

  getProviders(countryName: string): TopUpProvider[] {
    const providers = [];
    this.checkRampSupport(countryName) && providers.push(TopUpProvider.RAMP);
    this.checkSafelloSupport(countryName) && providers.push(TopUpProvider.SAFELLO);
    this.checkWyreSupport(countryName) && providers.push(TopUpProvider.WYRE);
    return providers;
  }
}
