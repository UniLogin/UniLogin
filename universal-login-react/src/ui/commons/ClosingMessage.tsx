import React from 'react';
import {classForComponent} from '../utils/classFor';
import '../styles/themes/UniLogin/components/closingMessageUniLogin.sass';

export const ClosingMessage = () =>
  <p className={classForComponent('closing-message')}>
    Creating is disabled. <a
      className={classForComponent('closing-message-link')}
      rel='noopener noreferrer'
      target='_blank'
      href='https://medium.com/universal-ethereum/out-of-gas-were-shutting-down-unilogin-3b544838df1a'>
      UniLogin is closing.
    </a><br />Please make sure to withdraw all funds before 31 Dec 2020</p>;
