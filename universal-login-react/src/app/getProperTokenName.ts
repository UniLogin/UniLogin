import {TokenDetails} from '@unilogin/commons';

const tokensWithSymbolAsName = ['USDC'];

export const getProperTokenName = (token: TokenDetails) => (tokensWithSymbolAsName.find(s => s === token.symbol) || token.name);
