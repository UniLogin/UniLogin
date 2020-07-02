import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {classForComponent, useClassFor} from '../utils/classFor';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {CompanyLogo} from '../..';
import Spinner from '../commons/Spinner';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {ensureNotFalsy} from '@unilogin/commons';
import {UnsupportedToken} from '../../core/utils/errors';
import {Erc20Icon} from '../commons/Erc20Icon';

interface ChooseTopUpTokenProps {
  onClick: (tokenAddress: string) => void;
  supportedTokens?: Array<string>;
  hideModal?: () => void;
  walletService: WalletService;
};

export const ChooseTopUpToken = ({supportedTokens = ['ETH'], onClick, hideModal, walletService}: ChooseTopUpTokenProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const handleClick = (token: any) => {
    setIsClicked(true);
    setSelectedToken(token);
    const tokenAddress = walletService.sdk.tokensDetailsStore.getTokenAddress(token);
    ensureNotFalsy(tokenAddress, UnsupportedToken, token);
    onClick(tokenAddress);
  };

  return (
    <ModalWrapper hideModal={hideModal} message={walletService.sdk.getNotice()}>
      <div className={useClassFor('top-up')}>
        <CompanyLogo />
        <div className={classForComponent('onboarding-progress-wrapper')}>
          <ModalProgressBar steps={4} progress={2}/>
        </div>
        <div className={classForComponent('top-up-header')}>
          <div className={classForComponent('top-up-choose-token')}>
            <ModalTitle>How do you wanna pay for account creation?</ModalTitle>
            <div className={classForComponent('top-up-methods')}>
              {supportedTokens && supportedTokens.map((tokenSymbol) => {
                const token = walletService.sdk.tokensDetailsStore.getTokenBy('symbol', tokenSymbol);
                return (
                  <button
                    key={tokenSymbol}
                    className={`${classForComponent('top-up-method')}`}
                    id={`top-up-token-${tokenSymbol}`}
                    onClick={() => handleClick(tokenSymbol)}
                    disabled={isClicked}>
                    <div className={classForComponent('top-up-radio-inner')}>
                      <div className={classForComponent('top-up-method-icons')}>
                        {selectedToken === tokenSymbol ? <Spinner/> : <Erc20Icon token={token} className={classForComponent('top-up-method-icon')} />}
                      </div>
                      <p className={classForComponent('top-up-method-title')}>{tokenSymbol}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
