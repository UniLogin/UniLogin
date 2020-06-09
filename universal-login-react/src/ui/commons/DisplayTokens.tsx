import React from 'react';
import {IToken} from '@unilogin/commons';

interface DisplayTokenProps {
  tokens?: IToken[];
}

const Token = ({image, name, description, background_color}: IToken) => (
  <div>
    <div style={{backgroundColor: background_color}}>
      <img src={image}></img>
    </div>
    <div>{name}</div>
    <div>{description}</div>
  </div>
);

const DisplayTokens = ({tokens}: DisplayTokenProps) => (
  <ul style={{listStyle: 'none'}}>
    {tokens?.map(token => (
      <li key={token.id}>
        <Token
          name={token.name}
          image={token.image}
          description={token.description}
          background_color={token.background_color}
        ></Token>
      </li>
    ))}
  </ul>
);

export default DisplayTokens;
