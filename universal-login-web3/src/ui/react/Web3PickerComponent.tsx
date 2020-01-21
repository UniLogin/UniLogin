import React from 'react';
import {ModalWrapper, useProperty} from '@universal-login/react';
import {Property} from 'reactive-properties';
import U from '../assets/U.svg';
import {Web3ProviderFactory} from '../../models/Web3ProviderFactory';
import styled from 'styled-components';

interface Web3PickerComponentProps {
  isVisibleProp: Property<boolean>;
  hideModal: () => void;
  factories: Web3ProviderFactory[];
  setProvider: (providerName: string) => void;

}

export const Web3PickerComponent = ({factories, isVisibleProp, hideModal, setProvider}: Web3PickerComponentProps) => {
  const isVisible = useProperty(isVisibleProp);
  let selectedProvider: string;

  const selectProvider = (name: string) => {
    selectedProvider = name;
  };

  const ButtonExit = styled.button`
    background-color: transparent;
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(67, 157, 176, 0.4);
    top: 8px;
    right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      /* TODO: exit button animation */
    }
  `;

  const ExitIcon = styled.div`
    width: 1px;
    height: 60%;
    background-color: #439DB0;
    transform: rotate(-45deg);
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: 100%;
      background-color: inherit;
      transform: rotate(90deg);
      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  const ModalTitle = styled.h3`
    font-size: 2.4rem;
    text-align: center;
    color: #0F0C4A;
  `;

  const ModalText = styled.p`
    font-size: 1.4rem;
    text-align: center;
    color: #7D7C9C;
  `;

  const ProviderList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 1.4rem;
    margin-top: 4rem;
  `;

  const ProviderButton = styled.button`
    background: #fff;
    border: 1px solid rgba(190, 207, 217, 0.6);
    border-radius: .4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.9rem 2.8rem 2.6rem 2.8rem;
    cursor: pointer;
    position: relative;

    &:hover {
      box-shadow: 0px 10px 40px rgba(0, 131, 188, 0.12);
    }
  `;

  const ProviderLabelTop = styled.p`
    position: absolute;
    top: 0;
    background-color: #fff;
    margin: 0;
    padding: 0 .4rem;
    transform: translateY(-50%);
    color: #7D7C9C;
  `;

  const ProviderLabelBottom = styled.p`
    position: absolute;
    color: #7D7C9C;
    bottom: 0;
  `;

  const ProviderIndicator = styled.div`
    width: .8rem;
    height: .8rem;
    position: absolute;
    top: .7rem;
    right: .7rem;
    border-radius: 50%;
    background: linear-gradient(91.66deg, #0ADBC2 0%, #07D1D1 100%);
  `;

  const ProviderLogo = styled.img`
    max-width: 3rem;
  `;

  const ProviderText = styled.h4`
    color: #12083A;
    margin-left: 1.45rem
  `;

  const ModalBox = styled.div`
    min-width: 50rem;
    min-height: 30rem;
    color: white;
    color: #0F0C4A;
    background-color: #fff;
    padding: 4.6rem 4.4rem 4rem;
    border-radius: .8rem;
    position: relative;
  `;

  const LoginButton = styled.button`
    color: #fff;
    width: 100%;
    border: none;
    background: linear-gradient(173.09deg, #00BFD9 0.28%, #527EEE 100%);
    border-radius: .4rem;
    padding: 1.15rem 0;
    font-size: 1.4rem;
    margin-top: 4rem;
    cursor: pointer;
  `;

  return isVisible
    ? <ModalWrapper>
      <ModalBox>
        <ButtonExit onClick={() => hideModal()}>
          <ExitIcon></ExitIcon>
        </ButtonExit>
        <ModalTitle>Login with your wallet</ModalTitle>
        <ModalText>Please select your provider</ModalText>
        <ProviderList>
          {factories.map(({name, icon}) =>
            <ProviderButton key={name} onClick={() => selectProvider(name)}>
              <ProviderLabelTop>Label1</ProviderLabelTop>
              <ProviderLogo src={U} />
              <ProviderText>{name}</ProviderText>
              <ProviderLabelBottom>Label2</ProviderLabelBottom>
              <ProviderIndicator></ProviderIndicator>
            </ProviderButton>,
          )}
        </ProviderList>
        <LoginButton onClick={() => setProvider(selectedProvider)}>Login</LoginButton>
      </ModalBox>
    </ModalWrapper>
    : null;
};
