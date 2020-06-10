import {fetch, InvalidNetwork} from '@unilogin/commons';
import {IErc721Token} from '../models/Erc721Token';

interface IBasicToken {
  tokenID: string;
  contractAddress: string;
}

const OPENSEA_API_URL = 'https://api.opensea.io/api/v1/asset';

const ETHERSCAN_API_URL = 'http://api.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=51GC96WCST6YU1BKYWGGX3PIT21UJPTFTE';

const getApisUrls = (network: string) => {
  if (network === 'rinkeby') {
    return [
      ETHERSCAN_API_URL.replace('api', `api-${network}`),
      OPENSEA_API_URL.replace('api', `${network}-api`),
    ];
  } else if (network !== 'mainnet') {
    throw new InvalidNetwork();
  }
  return [ETHERSCAN_API_URL, OPENSEA_API_URL];
};

const checkForMissingTokens = (basicTokens: IBasicToken[], currentTokens: IErc721Token[]) => {
  const missingTokens: IBasicToken[] = [];
  for (const basicToken of basicTokens) {
    let isMissing = true;
    for (const currentToken of currentTokens) {
      if (currentToken.id === basicToken.tokenID) {
        isMissing = false;
        break;
      }
    };
    if (isMissing) {
      missingTokens.push(basicToken);
    }
  };
  return missingTokens;
};

const getMissingTokens = async (missingTokens: IBasicToken[], openseaApi: string) => {
  const missingTokensDetails: IErc721Token[] = [];
  for (const missingToken of missingTokens) {
    const id = missingToken.tokenID;
    const token = await (await fetch(`${openseaApi}/${missingToken.contractAddress}/${id}`)).json();
    missingTokensDetails.push({
      id,
      name: token.name || token.collection.name + ' #' + id,
      image: token.image_preview_url,
      description: token.description,
      backgroundColor: token.background_color || '000000',
      tokenName: token.collection.name,
      externalink: token.external_link,
    });
  }
  return missingTokensDetails;
};

export const getErc721Tokens = async (walletAddress: string, currentTokens: IErc721Token[] = [], network = 'mainnet') => {
  const [etherscanApi, openseaApi] = getApisUrls(network);
  const basicTokens = (await (await fetch(`${etherscanApi}&address=${walletAddress}`)).json()).result;
  const missingTokens = checkForMissingTokens(basicTokens, currentTokens);
  const missingTokensDetails = await getMissingTokens(missingTokens, openseaApi);
  return currentTokens.concat(missingTokensDetails);
};
