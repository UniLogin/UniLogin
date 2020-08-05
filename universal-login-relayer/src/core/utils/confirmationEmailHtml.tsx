import React from 'react';
import {render} from 'mjml-react';

import {
  Mjml,
  MjmlHead,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlButton,
  MjmlImage,
  MjmlStyle,
  MjmlText,
  MjmlFont,
  MjmlSpacer,
  MjmlAttributes,
  MjmlGroup,
} from 'mjml-react';

interface ConfirmationEmailProps {
  clipboardUrl: string;
  code: string;
  logoUrl: string;
  username: string;
}

export const confirmationEmail = ({code, clipboardUrl, logoUrl, username}: ConfirmationEmailProps) => {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlFont name="Tajawal" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;900&display=swap" />
        <MjmlFont name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Tajawal:wght@500;900&display=swap" />
        <MjmlAttributes>
          <MjmlSection children="" padding="0" />
        </MjmlAttributes>
        <MjmlStyle>
          {`
            .card {
              box-shadow: 0px 24px 104px rgba(0, 131, 188, 0.1);
              border-radius: 16px;
            }

            .btn table {
              box-shadow: 0px 16px 32px rgba(0, 61, 181, 0.2);

            }

            @media only screen and (max-width: 500px) {
              .btn table {
                width: 280px;
              }
            }

            @media only screen and (max-width: 380px) {
              .btn table {
                width: 250px !important;
              }

              .title div {
                font-size: 35px !important;
                line-height: 50px !important;
              }
              .copyright div {
                font-size: 14px !important;
              }
              .subtitle div {
                font-size: 18px !important;
              }
              .login div {
                font-size: 25px !important;
              }
              .spacer-1 div {
                height: 20px !important;
              }
              .spacer-2 div {
                height: 20px !important;
              }
            }
          `}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody width={600}>
        <MjmlSection>
          <MjmlColumn>
            <MjmlSpacer height={10} />
            <MjmlText cssClass="title" font-size="42px" lineHeight="72px" color="#0F0C4A" text-align="left" font-family="Tajawal, sans-serif">Hi {username} 🥳</MjmlText>
            <MjmlText cssClass="subtitle" font-size="20px" lineHeight="36px" color="#7D7C9C" font-family="Lato, sans-serif" fontWeight={400}>To make sure your UniLogin account is safe and secure, we ask you to <b>authenticate your email address</b> by copying the code below and pasting it in UniLogin.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSpacer cssClass="spacer-1" height={10} />
        <MjmlSection>
          <MjmlColumn cssClass="card" backgroundColor="white" borderRadius={16} width="402px" padding="20px 0">
            <MjmlText cssClass="login" font-size="32px" fontWeight={900} line-heigh="72px" align="center" color="#0F0C4A" font-family="Tajawal, sans-serif" lineHeight="36px" letterSpacing="-o.5px">{code}</MjmlText>
            <MjmlSpacer height={5} />
            <MjmlButton href={`${clipboardUrl}?code=${code}`} cssClass="btn" width="368px" height={56} innerPadding="19px 0 11px !important" verticalAlign="middle" fontSize={18} fontWeight={500} fontFamily="Tajawal, sans-serif" backgroundColor="#0E31B6" borderRadius="8px" color="white">COPY</MjmlButton>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSpacer cssClass="spacer-2" height={10} />
        <MjmlSection backgroundColor="white">
          <MjmlGroup>
            <MjmlColumn>
              <MjmlImage width="128px" align="left" height="33px" alt="UniLogin" title="UniLogin" src={logoUrl} />
              <MjmlSpacer height={10} />
            </MjmlColumn>
            <MjmlColumn>
              <MjmlText cssClass="copyright" font-size="16px" align="right" color="#7D7C9C" font-family="Tajawal, sans-serif" lineHeight="36px" fontWeight={500} letterSpacing="-o.5px">© 2019 UniLogin</MjmlText>
            </MjmlColumn>
          </MjmlGroup>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  );
};

export const confirmationEmailHtml = ({code, clipboardUrl, logoUrl, username}: ConfirmationEmailProps) => render(confirmationEmail({code, clipboardUrl, logoUrl, username}), {validationLevel: 'soft'}).html;
