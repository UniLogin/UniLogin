import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {classForComponent, useClassFor} from '../utils/classFor';
import {ModalTitle} from '../commons/Modal/ModalTitle';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {CompanyLogo} from '../..';
import {getIconForToken} from '../../core/utils/getIconForToken';
import Spinner from '../commons/Spinner';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {ensureNotFalsy} from '@unilogin/commons';
import {UnsupportedToken} from '../../core/utils/errors';

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
              {supportedTokens && supportedTokens.map((token) => {
                return (
                  <button
                    key={token}
                    className={`${classForComponent('top-up-method')}`}
                    id={`top-up-token-${token}`}
                    onClick={() => handleClick(token)}
                    disabled={isClicked}>
                    <div className={classForComponent('top-up-radio-inner')}>
                      <div className={classForComponent('top-up-method-icons')}>
                        {selectedToken === token ? <Spinner/> : <img className={classForComponent('top-up-method-icon')} src={getIconForToken(token)} alt={token} />}
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
    </ModalWrapper>
  );
};
