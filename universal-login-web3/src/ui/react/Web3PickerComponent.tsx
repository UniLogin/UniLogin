import React, {useState} from 'react';
import {ModalWrapper, useProperty} from '@unilogin/react';
import {Property} from 'reactive-properties';
import {Web3ProviderFactory} from '../../models/Web3ProviderFactory';
import {ButtonPrimary} from './common/Button/Button';
import styled from 'styled-components';
import ProviderSelect from './ProviderSelect';
import {Title} from './common/Text/Title';
import {Text} from './common/Text/Text';
import {createGlobalStyle} from 'styled-components';

export interface IWeb3PickerComponentProps {
  isVisibleProp: Property<boolean>;
  hideModal: () => void;
  factories: Web3ProviderFactory[];
  setProvider: (providerName: string) => void;
}

interface IProviderListProps {
  providerCount: number;
}

export const Web3PickerComponent = ({factories, isVisibleProp, hideModal, setProvider}: IWeb3PickerComponentProps) => {
  const isVisible = useProperty(isVisibleProp);
  const [selectedProvider, setSelectedProvider] = useState('UniLogin');

  return isVisible
    ? <ModalWrapper hideModal={hideModal}>
      <GlobalStyle />
      <ModalBox>
        <ModalTitle>Login with your wallet</ModalTitle>
        <ModalText>Please select your provider</ModalText>
        <ProviderList providerCount={factories.length}>
          {factories.map(({name, icon}) =>
            <ProviderSelect selectedProvider={selectedProvider} name={name} icon={icon} key={name} onClick={() => setSelectedProvider(name)}/>,
          )}
        </ProviderList>
        <Footer>
          <LoginButton onClick={() => setProvider(selectedProvider)}>Login</LoginButton>
        </Footer>
      </ModalBox>
    </ModalWrapper>
    : null;
};

const GlobalStyle = createGlobalStyle`
  .unilogin-component-modal-wrapper {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 770px;
    width: 100%;
    padding: 0 0 41px;
    padding: unset;
    overflow-y: auto;
    @import url('https://fonts.googleapis.com/css?family=Lato:300,400&display=swap');
    font-family: 'Lato', sans-serif;
  }

  .modal-close-btn {
    z-index: 100;
    position: absolute;
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(67, 157, 176, 0.4);
    background: none;
    cursor: pointer;
    right: .8rem;
    top: .8rem;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 1px;
      height: 11px;
      background-color: #7D7C9C;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      width: 1px;
      height: 11px;
      background-color: #7D7C9C;
    }

    @media only screen and (max-width: 600px) {
      top: 1.1rem;
      right: 1.6rem;
    }
  .modal {
    overflow: visible;
    background: unset;
    overflow-y: auto;
    border-radius: unset;
    height: 100%;
  }

  @media only screen and (max-width: 600px) {
    .unilogin-component-modal-wrapper {
      height: 100%;
      overflow-y: auto;
      max-width: unset;
    }
  }

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    .unilogin-component-modal-wrapper {
      max-width: unset;
    }
  }
`;

const ModalTitle = styled(Title)`
  font-size: 2.4rem;
  margin-top: 6.2rem;
  font-weight: 300;

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    grid-template-columns: 1fr;
    margin-top: 6.2rem;
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    margin-top: 6.2rem;
    font-weight: normal;
  }
`;

const ModalText = styled(Text)`
  font-size: 1.4rem;
  text-align: center;
  margin-top: 2.4rem;
`;

const ProviderList = styled.div<IProviderListProps>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 1.4rem;
  margin-top: 4rem;
  margin-bottom: 4rem;
  ${props => (props.providerCount === 2) && `
      grid-template-columns: repeat(2, 1fr);
  `}

  @media only screen and (max-width: 600px) {
    margin-top: 1.6rem;
    grid-template-columns: 1fr;
    margin-bottom: 2.5rem;
  }
`;

const ModalBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 50rem;
  min-height: 30rem;
  color: white;
  color: #0F0C4A;
  padding: 4.6rem 4.4rem 4rem;
  border-radius: .8rem;
  position: relative;
  padding-bottom: 3.2px;
  background-color: #fff;
  overflow-y: auto;

  @media only screen and (max-width: 600px) {
    min-width: unset;
    min-height: unset;
    width: 100%;
    min-height: 100%;
    border-radius: unset;
    padding: 0 1.6rem;
  }

  @media only screen and (max-height: 425px) {
    border-radius: unset;
  }

  @media only screen and (orientation: landscape) {
    width: 100%;
    padding-top: 0;
  }

  @media only screen and (orientation: landscape) and (max-width: 600px) {
    width: 100%;
    padding-top: 0;
    border-radius: unset;
  }

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    width: 100%;
    padding-top: 0;
  }
`;

const Footer = styled.div`
  margin-top: auto;
`;

const LoginButton = styled(ButtonPrimary)`
  width: 100%;
  font-size: 1.4rem;
  margin-bottom: 4rem;
  flex-grow: 1;
  text-align: center;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    margin-bottom: 1.6rem;
    min-height: 40px;
  }
`;
