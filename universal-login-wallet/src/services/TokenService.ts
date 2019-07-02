import {providers} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getTokenDetails} from './utils/utils';
import {TokenDetails} from '../core/entities/TokenDetails';

class TokenService {
  tokensDetails: TokenDetails[];

  constructor(private tokensAddresses: string[], private provider: providers.Provider) {
    this.tokensDetails = [{name: '', symbol: '', address: ''}];
  }

  async start() {
    for (let count = 0; count < this.tokensAddresses.length; count++) {
      if (this.tokensAddresses[count] === ETHER_NATIVE_TOKEN.address){
        this.tokensDetails[count] = ETHER_NATIVE_TOKEN;
      } else {
        this.tokensDetails[count] = await getTokenDetails(this.provider, this.tokensAddresses[count]);
      }
    }
  }

  getTokenAddress(symbol: string) {
    const token = this.tokensDetails.find(token => token.symbol === symbol);
    return token ? token.address : undefined;
  }
}

export default TokenService;
