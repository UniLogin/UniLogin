import React from 'react';
import {IErc721Token} from '@unilogin/commons';
import {ThemedComponent} from './ThemedComponent';
import {Spinner} from './Spinner';
import {classForComponent} from '../utils/classFor';
import UniLoginSdk from '@unilogin/sdk';

interface DisplayErc721TokensProps {
  sdk: UniLoginSdk;
  tokens?: IErc721Token[];
}

interface TokenProps {
  token: IErc721Token;
}

const Erc721Token = ({token}: TokenProps, key: string) => (
  <ThemedComponent key={key} name="assets-item">
    <div className="assets-token-item-row">
      <div className="assets-token-img-wrapper" style={{backgroundColor: `#${token.backgroundColor}`}}>
        <img className="assets-token-img" src={token.image} alt={`${token.tokenName} logo`}/>
      </div>
      <div className="assets-token-content">
        <div className="assets-token-title-section">
          <h4 className="assets-one-line-paragraph assets-token-family-name">{token.tokenName}</h4>
          <a className="assets-token-name" href={token.externalink} target="_blank" rel="noopener noreferrer">{token.name}</a>
        </div>
        <div className="assets-token-description">{token.description}</div>
      </div>
    </div>
  </ThemedComponent>
);

const Erc721Tokens = ({sdk, tokens}: DisplayErc721TokensProps) => {
  if (tokens === undefined) {
    return <div className="assets-centered-box"><Spinner className={classForComponent('spinner-center')}/></div>;
  }
  if (tokens.length <= 0) {
    const network = sdk.config.network;
    const responseText = sdk.erc721TokensService.isOnSupportedNetwork() ? 'You don\'t have any tokens yet 🧐' : `ERC721 tokens are not supported on ${network}`;
    return <div className="assets-centered-box">{responseText}</div>;
  }
  return <>{tokens.map(token => (
    <Erc721Token token={token} key={token.id}></Erc721Token>
  ))}</>;
};

export default Erc721Tokens;
