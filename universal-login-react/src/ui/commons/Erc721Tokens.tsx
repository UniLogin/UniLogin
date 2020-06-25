import React from 'react';
import {IErc721Token} from '@unilogin/commons';
import {ThemedComponent} from './ThemedComponent';
import {Spinner} from './Spinner';
import {classForComponent} from '../utils/classFor';

interface DisplayErc721TokensProps {
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
          <h5 className="assets-one-line-paragraph assets-token-family-name">{token.tokenName}</h5>
          <a className="assets-token-name" href={token.externalink} target="_blank" rel="noopener noreferrer">{token.name}</a>
        </div>
        <div className="assets-token-description">{token.description}</div>
      </div>
    </div>
  </ThemedComponent>
);

const Erc721Tokens = ({tokens}: DisplayErc721TokensProps) => {
  if (tokens === undefined) {
    return <div className="assets-centered-box"><Spinner className={classForComponent('spinner-center')}/></div>;
  }
  if (tokens.length <= 0) {
    return <div className="assets-centered-box">You don&apos;t have any tokens yet 🧐</div>;
  }
  return <>{tokens.map(token => (
    <Erc721Token token={token} key={token.id}></Erc721Token>
  ))}</>;
};

export default Erc721Tokens;
