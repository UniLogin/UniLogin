import React from 'react';
import {BG_DATA_URL} from '../../../assets/dataURI/emailBackground';

import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlButton,
  MjmlImage,
  MjmlStyle,
  MjmlText,
  MjmlFont,
  MjmlHero,
  MjmlSpacer,
  MjmlAttributes
} from 'mjml-react';

export const generate = () => {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>Email Confirmation</MjmlTitle>
        <MjmlFont name="Tajawal" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;900&display=swap" />
        <MjmlFont name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Tajawal:wght@500;900&display=swap" />
        <MjmlAttributes>
          <MjmlSection padding={0}/>
        </MjmlAttributes>
      </MjmlHead>
      <MjmlBody width={599}>
      <MjmlHero backgroundSize="contain" backgroundRepeat="no-repeat" backgroundUrl={BG_DATA_URL}>
        <MjmlSection border="2px solid red">
        <MjmlColumn>
          <MjmlImage width="128px" align="left" height="33px" src="https://unilogin.io/LogoTitle.14f50053.svg" />
          <MjmlSpacer height={40}/>
          <MjmlText font-size="52px" lineHeigh="72px" color="#0F0C4A" textAlign="left" margin="10px 0 0" font-family="Tajawal, sans-serif">Email Confirmation</MjmlText>
          <MjmlSpacer height={4}/>
          <MjmlText font-size="22px" lineHeight="36px" color="#7D7C9C" font-family="Lato, sans-serif" fontWeight="norml margin: 0">To make sure your UniLogin account is safe and secure, we ask you to <b>authenticate your email address</b> by copying the code below and pasting it in UniLogin.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlSpacer height={110}/>
      <MjmlSection>
        <MjmlColumn backgroundColor="white" borderRadius={16} width="462px" padding="60px 0">
          <MjmlText font-size="32px" fontWeight={900} lineHeigh="72px" align="center" color="#0F0C4A" font-family="Tajawal, sans-serif" lineHeight="36px" fontWeight="normal" letterSpacing="-o.5px" margin="0">uni-login-291862</MjmlText>
          <MjmlSpacer height={20}/>
          <MjmlButton class="button" width="368px" padding="19px 0 15px" height="56px" verticalAlign="middle" fontSize={18} fontWeight="bold" fontFamily="Tajawal, sans-serif" backgroundColor="#0E31B6" borderRadius="8px" color="white">COPY</MjmlButton>
        </MjmlColumn>
      </MjmlSection>
      <MjmlSpacer height={208}/>
      <MjmlSection backgroundColor="white">
        <MjmlColumn>
          <MjmlImage width="128px" align="left" height="33px" src="https://unilogin.io/LogoTitle.14f50053.svg"/>
        </MjmlColumn>
        <MjmlColumn>
          <MjmlText font-size="16px" align="right" color="#7D7C9C" font-family="Tajawal, sans-serif" lineHeight="36px" fontWeight="normal" letterSpacing="-o.5px" margin="0">© 2019 UniLogin</MjmlText>
        </MjmlColumn>
      </MjmlSection>
      </MjmlHero>
      </MjmlBody>
    </Mjml>
  );
};
