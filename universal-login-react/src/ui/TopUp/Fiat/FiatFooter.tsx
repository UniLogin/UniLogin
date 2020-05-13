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
import {InfoText} from '../../commons/Text/InfoText';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

interface FiatFooterProps {
  walletService: WalletService;
  paymentMethod?: TopUpProvider;
  selectedCurrency: string;
}
export const FiatFooter = ({paymentMethod, walletService, selectedCurrency}: FiatFooterProps) => {
  const currencyAddress = walletService.sdk.tokensDetailsStore.getTokenAddress(selectedCurrency);
  const currencyDetails = useAsync(() => walletService.sdk.tokenDetailsService.getTokenDetails(currencyAddress || ETHER_NATIVE_TOKEN.address), [])[0];
  const [minimumAmount] = useAsync(async () => {
    if (paymentMethod) {return getMinimalAmount(walletService, paymentMethod, walletService.sdk.tokenPricesService, currencyDetails);}
  }, [paymentMethod]);

  switch (paymentMethod) {
    case TopUpProvider.RAMP:
      return (
        <>
          <div className="info-block info-row">
            <InfoText>You can pay with any UK bank or Revolut</InfoText>
            <img src={RevolutLogo} srcSet={RevolutLogo2x} className="revolut-logo" alt="Revolut" />
          </div>
          {minimumAmount && <div className="info-block info-row">
            <InfoText>Minimum amount is {minimumAmount}</InfoText>
          </div>}
        </>
      );

    case TopUpProvider.SAFELLO:
      return (
        <>
          <VisaMasterCardInfo />
          <div className="info-block info-row">
            <InfoText>You have to install Yoti mobile app</InfoText>
            <img src={Yoti} srcSet={Yoti2x} className="yoti-logo" alt="Yoti" />
          </div>
          <div className="info-block info-row">
            <InfoText>Minimum amount is {minimumAmount}</InfoText>
          </div>
        </>
      );

    case TopUpProvider.WYRE:
      return <>
        <VisaMasterCardInfo />
        {minimumAmount && <div className="info-block info-row">
          <InfoText>Minimum amount is {minimumAmount}</InfoText>
        </div>}
      </>;
    default:
      return (
        <InfoText>Choose payment method</InfoText>
      );
  }
};

const VisaMasterCardInfo = () => <div className="info-block info-row">
  <div className="info-row">
    <InfoText>You can pay with Visa or Mastercard</InfoText>
    <img src={VisaLogo} srcSet={VisaLogo2x} className="visa-logo" alt="Visa" />
    <img src={MastercardLogo} srcSet={MastercardLogo2x} className="mastercard-logo" alt="Mastercard" />
  </div>
</div>;
