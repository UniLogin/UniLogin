import {withPrefix} from 'bem-components-react';
import {CompanyLogo, ModalWrapper} from '@unilogin/react';
import React from 'react';
import {ButtonPrimary} from './common/Button/Button';
import warning from '../assets/warning.svg';
import '../styles/base/localStorageBlockWarningScreen.sass'

const bem = withPrefix('u');

export const LocalStorageBlockedWarningScreen = () => (
  <ModalWrapper modalClassName="u-warning-screen__modal">
    <Container>
      <WarningIcon src={warning}/>
      <CompanyLogo className="u-warning-screen__company-logo"/>
      <Heading>Local storage is blocked</Heading>
      <Description>
        Your browser isn't letting us save your private key.
        This means that you will lose all your funds once you leave the page.
        Most likely this is caused by privacy settings in your browser.
        Please disable the protection and refresh the page.
      </Description>
      <ButtonPrimary
        onClick={() => location.reload()}
        className="u-warning-screen__button"
      >
        Refresh
      </ButtonPrimary>
    </Container>
  </ModalWrapper>
);

const Container = bem.div('warning-screen');
const WarningIcon = bem.img('warning-screen__warning-icon');
const Heading = bem.h1('warning-screen__heading');
const Description = bem.div('warning-screen__description');
