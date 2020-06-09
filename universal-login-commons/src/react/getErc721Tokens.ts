import {fetch} from '../integration/http/fetch';
import {OPENSEA_API_HTTP, ETHERSCAN_API_HTTP} from '../core/constants/constants';

export interface IToken {
  id?: string;
  name?: string;
  image?: string;
  description?: string;
  background_color?: string;
}

export const getErc721Tokens = async (walletAddress: string, network = 'mainnet') => {
  let etherscanApi = ETHERSCAN_API_HTTP;
  let openseaApi = OPENSEA_API_HTTP;
  if (network === 'rinkeby') {
    etherscanApi = etherscanApi.replace('api', `api-${network}`);
    openseaApi = openseaApi.replace('api', `${network}-api`);
  }
  const tokensBasics = (await (await fetch(`${etherscanApi}&address=${walletAddress}`)).json()).result;
  const tokens: IToken[] = [];
  for (let i = 0; i < tokensBasics.length; i++) {
    const id = tokensBasics[i].tokenID;
    const token = await (await fetch(`${openseaApi}/${tokensBasics[i].contractAddress}/${id}`)).json();
    tokens.push({
      id,
      name: token.name,
      image: token.image_preview_url,
      description: token.description,
      background_color: token.background_color,
    });
  }
  return tokens;
};
