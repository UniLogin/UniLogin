import React from 'react';
import MastercardLogo from './../../assets/logos/mastercard.jpg';
import MastercardLogo2x from './../../assets/logos/mastercard@2x.jpg';
import VisaLogo from './../../assets/logos/visa.jpg';
import VisaLogo2x from './../../assets/logos/visa@2x.jpg';

interface FiatFooterProps {
  isPaymentMethodChecked: boolean;
}

export const FiatFooter = ({isPaymentMethodChecked}: FiatFooterProps) => (
  <>
    {
      isPaymentMethodChecked
        ? <div className="info-block info-row">
          <p className="info-text info-text-hint">You can pay by MasterCard or Visa</p>
          <div className="info-row">
            <img
              src={VisaLogo}
              srcSet={VisaLogo2x}
              className="visa-logo"
              alt="Visa"
            />
            <img
              src={MastercardLogo}
              srcSet={MastercardLogo2x}
              className="mastercard-logo"
              alt="Mastercard"
            />
          </div>
        </div>
        : <p className="info-text info-text-warning">Choose payment method</p>
    }
  </>
);
