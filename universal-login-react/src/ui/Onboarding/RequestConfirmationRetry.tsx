import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {SnackWaiting} from '../commons/SnackWaiting';
import {SnackWithButton} from '../commons/SnackWithButton';
import {WalletService} from '@unilogin/sdk';

export interface TooMuchTimeAlertProps {
  walletService: WalletService;
}

export const RequestConfirmationRetry = ({walletService}: TooMuchTimeAlertProps) => {
  const [retryState, setRetryState] = useState<'INITIAL' | 'BE_PATIENT' | 'RETRY'>('INITIAL');
  const history = useHistory();
  useEffect(() => {
    switch (retryState) {
      case 'INITIAL': {
        const timeoutId = setTimeout(() => setRetryState('BE_PATIENT'), 60 * 1000);
        return () => clearTimeout(timeoutId);
      }
      case 'BE_PATIENT': {
        const timeoutId = setTimeout(() => setRetryState('RETRY'), 7 * 60 * 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [retryState]);

  const handleRetry = async () => {
    try {
      const promise = walletService.retryRequestEmailConfirmation();
      setRetryState('INITIAL');
      await promise;
    } catch (e) {
      walletService.disconnect();
      history.push('/error', {message: e.message});
    }
  };

  switch (retryState) {
    case 'INITIAL':
      return null;
    case 'BE_PATIENT':
      return <SnackWaiting text={'It can take some time... Be patient...'} />;
    case 'RETRY':
      return <SnackWithButton buttonText='Retry' text='No email yet?' onClick={handleRetry} />;
  }
};
