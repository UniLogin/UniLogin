import {CompanyLogo, ModalWrapper} from '@unilogin/react';
import React from 'react';
import {ButtonPrimary} from '../common/Button/Button';
import warning from '../../assets/warning.svg';
import '../../styles/base/localStorageBlockWarningScreen.sass';
import {Container, Description, Footer, Heading, WarningIcon} from './common';

export const LocalStorageBlockedWarningScreen = () => (
  <ModalWrapper modalClassName="u-warning-screen__modal">
    <Container>
      <WarningIcon src={warning}/>
      <CompanyLogo className="u-warning-screen__company-logo"/>
      <Heading>Local storage is blocked</Heading>
      <Description>
        Your browser isn&apos;t letting us save your private key.
        This means that you will lose all your funds once you leave the page.
        Most likely this is caused by privacy settings in your browser.
        Please disable the protection and refresh the page.
      </Description>
      <Footer>
        <ButtonPrimary
          onClick={() => location.reload()}
          className="u-warning-screen__button"
        >
          Refresh
        </ButtonPrimary>
      </Footer>
    </Container>
  </ModalWrapper>
);
