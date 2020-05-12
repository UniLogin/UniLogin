import React from 'react';
import {classForComponent, useClassFor} from '../utils/classFor';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {CompanyLogo} from '../..';
import {getIconForToken} from '../../core/utils/getIconForToken';

interface ChooseTopUpTokenProps {
  supportedTokens?: Array<string>;
};

export const ChooseTopUpToken = ({supportedTokens = ['ETH']}: ChooseTopUpTokenProps) => {
  return (
    <div className={useClassFor('top-up')}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={4} progress={2}/>
      </div>
      <div className={classForComponent('top-up-header')}>
        <div className={classForComponent('top-up-choose-token')}>
          <ModalTitle>How do you wanna pay for account creation?</ModalTitle>
          <div className={classForComponent('top-up-methods')}>
            {supportedTokens && supportedTokens.map((token) => {
              return (
                <button key={token} className={`${classForComponent('top-up-method')}`} onClick={(token) => console.log(token)}>
                  <div className={classForComponent('top-up-radio-inner')}>
                    <div className={classForComponent('top-up-method-icons')}>
                      <img className={classForComponent('top-up-method-icon')} src={getIconForToken(token)} alt={token} />
                    </div>
                    <p className={classForComponent('top-up-method-title')}>{token}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
