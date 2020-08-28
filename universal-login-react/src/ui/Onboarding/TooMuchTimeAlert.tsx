import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {SnackQueueBar} from '../commons/SnackBarQueue';
import {SnackWaiting} from '../commons/SnackWaiting';
import {SnackWithButton} from '../commons/SnackWithButton';
import {WalletService} from '@unilogin/sdk';

export interface TooMuchTimeAlertProps {
  walletService: WalletService;
}

export const TooMuchTimeAlert = ({walletService}: TooMuchTimeAlertProps) => {
  const [retried, setRetried] = useState(false);
  const history = useHistory();
  const handleRetry = async () => {
    try {
      const promise = walletService.retryCreateRequested();
      setRetried(true);
      await promise;
    } catch (e) {
      walletService.disconnect();
      history.push('/error', {message: e.message});
    }
  };
  return (!retried
    ? <SnackQueueBar snackQueue={[
      {delay: 5, element: <SnackWaiting text={'It can take some time... Be patient...'} />},
      {
        delay: 5,
        element: <SnackWithButton buttonText='Retry' text='No email yet?' onClick={handleRetry} />,
      },
    ]} />
    : null);
};
