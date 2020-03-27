import React from 'react';
import {WalletService} from '@unilogin/sdk';
import MastercardLogo from './../../assets/logos/mastercard.jpg';
import MastercardLogo2x from './../../assets/logos/mastercard@2x.jpg';
import VisaLogo from './../../assets/logos/visa.jpg';
import VisaLogo2x from './../../assets/logos/visa@2x.jpg';
import RevolutLogo from './../../assets/logos/revolut.jpg';
import RevolutLogo2x from './../../assets/logos/revolut@2x.jpg';
import Yoti from './../../assets/logos/yoti.jpg';
import Yoti2x from './../../assets/logos/yoti@2x.jpg';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {getMinimalAmount} from '../../../core/utils/getMinimalAmountForFiatProvider';
import {useAsync} from '../../hooks/useAsync';

interface FiatFooterProps {
  walletService: WalletService;
  paymentMethod?: TopUpProvider;
}

export const FiatFooter = ({paymentMethod, walletService}: FiatFooterProps) => {
  const [minimumAmount] = useAsync(async () => {
    if (paymentMethod) {return getMinimalAmount(walletService, paymentMethod);}
  }, [paymentMethod]);

  switch (paymentMethod) {
    case TopUpProvider.RAMP:
      return (
        <>
          <div className="info-block info-row">
            <div className="info-row">
              <p className="info-text info-text-hint">You can pay with any UK bank or Revolut</p>
              <img src={RevolutLogo} srcSet={RevolutLogo2x} className="revolut-logo" alt="Revolut" />
            </div>
          </div>
          <div className="info-block info-row">
            <p className="info-text info-text-hint">Minimum amount is {minimumAmount} ETH</p>
          </div>
        </>
      );

    case TopUpProvider.SAFELLO:
      return (
        <>
          <VisaMasterCardInfo />
          <div className="info-block info-row">
            <p className="info-text info-text-hint">You have to install Yoti mobile app</p>
            <img src={Yoti} srcSet={Yoti2x} className="yoti-logo" alt="Yoti" />
          </div>
          <div className="info-block info-row">
            <p className="info-text info-text-hint">Minimum amount is {minimumAmount}€</p>
          </div>
        </>
      );

    case TopUpProvider.WYRE:
      return <VisaMasterCardInfo />;
    default:
      return (
        <p className="info-text info-text-warning">Choose payment method</p>
      );
  }
};

const VisaMasterCardInfo = () => <div className="info-block info-row">
  <div className="info-row">
    <p className="info-text info-text-hint">You can pay with Visa or Mastercard</p>
    <img src={VisaLogo} srcSet={VisaLogo2x} className="visa-logo" alt="Visa" />
    <img src={MastercardLogo} srcSet={MastercardLogo2x} className="mastercard-logo" alt="Mastercard" />
  </div>
</div>;
