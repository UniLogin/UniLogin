import {fetch} from '../../../src';
import {IBasicErc721Token, IErc721Token} from '../models/Erc721Token';

const OPENSEA_API_URL = 'https://api.opensea.io/api/v1/asset';

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=51GC96WCST6YU1BKYWGGX3PIT21UJPTFTE';

export class Erc721TokensService {
  private etherscanApi?: string;
  private openseaApi?: string;

  constructor(private network = 'mainnet') {
    [this.etherscanApi, this.openseaApi] = this.getApisUrls();
  }

  isOnSupportedNetwork() {
    return (['mainnet', 'rinkeby'].indexOf(this.network) >= 0);
  }

  getTokensForAddress = async (walletAddress: string) => {
    return this.etherscanApi ? (await (await fetch(`${this.etherscanApi}&address=${walletAddress}`)).json()).result as IBasicErc721Token[] : [];
  };

  getTokensDetails = async (basicTokens: IBasicErc721Token[]) => {
    if (!this.openseaApi) return [];

    const detailedTokensDetails: IErc721Token[] = [];
    for (const basicToken of basicTokens) {
      const id = basicToken.tokenID;
      const token = await (await fetch(`${this.openseaApi}/${basicToken.contractAddress}/${id}`)).json();
      detailedTokensDetails.push({
        id,
        name: token.name || token.collection.name + ' #' + id,
        image: token.image_preview_url,
        description: token.description,
        backgroundColor: token.background_color || '000000',
        tokenName: token.collection.name,
        externalink: token.external_link,
      });
    }
    return detailedTokensDetails;
  };

  getErc721Tokens = async (walletAddress: string) => {
    const basicTokens = await this.getTokensForAddress(walletAddress);
    const erc721Tokens = await this.getTokensDetails(basicTokens);
    return erc721Tokens;
  };

  private getApisUrls = () => {
    switch (this.network) {
      case 'rinkeby':
        return [
          ETHERSCAN_API_URL.replace('api', `api-${this.network}`),
          OPENSEA_API_URL.replace('api', `${this.network}-api`),
        ];
      case 'mainnet':
        return [ETHERSCAN_API_URL, OPENSEA_API_URL];
      default:
        console.log('Collectables works only on mainnet and rinkeby networks');
        return [];
    }
  };
}
