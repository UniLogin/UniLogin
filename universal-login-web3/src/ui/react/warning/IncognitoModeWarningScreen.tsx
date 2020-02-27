import {CompanyLogo, ModalWrapper} from '@unilogin/react';
import React, {useState} from 'react';
import {ButtonPrimary} from '../common/Button/Button';
import warning from '../../assets/warning.svg';
import '../../styles/base/localStorageBlockWarningScreen.sass';
import {Container, Description, Footer, Heading, WarningIcon} from './common';
import {bem} from '../bem';

export interface IncognitoModeWarningScreen {
  onProceed: () => void;
}

export const IncognitoModeWarningScreen = ({onProceed}: IncognitoModeWarningScreen) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  return (
    <ModalWrapper modalClassName="u-warning-screen__modal">
      <Container>
        <WarningIcon src={warning}/>
        <CompanyLogo className="u-warning-screen__company-logo"/>
        <Heading>You&apos;re in incognito mode</Heading>
        <Description>
          You are browsing this page in incognito mode.
          This means that you will lose all your funds once you leave the page.
          Please disable the incognito mode and refresh the page.
        </Description>
        <Footer>
          <ButtonPrimary
            onClick={() => location.reload()}
            className="u-warning-screen__button"
          >
            Refresh
          </ButtonPrimary>
          <AdvancedText onClick={() => setAdvancedOpen(!advancedOpen)}>
            {advancedOpen ? 'Hide advanced' : 'Show advanced'}
          </AdvancedText>
        </Footer>
        {advancedOpen && <ProceedLink onClick={onProceed}>
          Proceed at risk of loosing money
        </ProceedLink>}
      </Container>
    </ModalWrapper>
  );
};

const AdvancedText = bem.div('warning-screen__advanced-text');
const ProceedLink = bem.a('warning-screen__proceed-link');
