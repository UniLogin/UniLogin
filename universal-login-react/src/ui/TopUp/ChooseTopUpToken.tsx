import React from 'react';
import {classForComponent, useClassFor} from '../utils/classFor';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import EthereumIcon from './../assets/icons/ether.svg';
import DaiIcon from './../assets/icons/dai.svg';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {CompanyLogo} from '../..';

interface ChooseTopUpTokenProps {
  supportedTokens?: Array<string>;
};

export const ChooseTopUpToken = ({supportedTokens = ['ETH']}: ChooseTopUpTokenProps) => {
  return (
    <div className={useClassFor('top-up')}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={3} progress={2}/>
      </div>
      <div className={classForComponent('top-up-header')}>
        <div className={classForComponent('top-up-crypto-coin')}>
          <ModalTitle>How do you wanna pay for account creation?</ModalTitle>
          <div className={classForComponent('top-up-choose-pay-method')}>
            <div className={classForComponent('top-up-methods')}>
              {supportedTokens && supportedTokens.map((token) => {
                return (
                  <div key={token} className={`${classForComponent('top-up-method')}`}>
                    <div className={classForComponent('top-up-radio-inner')}>
                      <div className={classForComponent('top-up-method-icons')}>
                        <img className={classForComponent('top-up-method-icon')} src={token === 'ETH' ? EthereumIcon : DaiIcon} alt={token} />
                      </div>
                      <p className={classForComponent('top-up-method-title')}>{token}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
