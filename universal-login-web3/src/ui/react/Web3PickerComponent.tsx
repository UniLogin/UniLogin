import React, {useState} from 'react';
import {ModalWrapper, useProperty} from '@universal-login/react';
import {Property} from 'reactive-properties';
import {Web3ProviderFactory} from '../../models/Web3ProviderFactory';
import {CloseButton} from './common/Button/CloseButton';
import {ButtonPrimary} from './common/Button/Button';
import styled from 'styled-components';
import ProviderSelect from './ProviderSelect';
import {Title} from './common/Text/Title';
import {Text} from './common/Text/Text';
import {createGlobalStyle} from 'styled-components';

interface IWeb3PickerComponentProps {
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
  const [selectedProvider, setSelectedProvider] = useState('UniversalLogin');

  return isVisible
    ? <ModalWrapper>
      <GlobalStyle />
      <ModalBox>
        <ModalBoxWrapper>
          <ButtonExit onClick={() => hideModal()}>
          </ButtonExit>
          <ModalTitle>Login with your wallet</ModalTitle>
          <ModalText>Please select your provider</ModalText>
          <ProviderList providerCount={factories.length}>
            {factories.map(({name, icon}) =>
              <ProviderSelect selectedProvider={selectedProvider} name={name} icon={icon} key={name} onClick={() => setSelectedProvider(name)}/>,
            )}
          </ProviderList>
          <LoginButton onClick={() => setProvider(selectedProvider)}>Login</LoginButton>
        </ModalBoxWrapper>
      </ModalBox>
      <ModalBackground />
    </ModalWrapper>
    : null;
};

const GlobalStyle = createGlobalStyle`
  .universal-login-default .modal-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 770px;
    width: 100%;
    min-height: initial;
    min-height: unset;
    padding: 0 0 41px;
    max-height: 100%;
    padding: unset;
    overflow-y: auto;
  }

  .universal-login-default .modal-wrapper .center {
  }

  .universal-login-default .modal {
    overflow: visible;
    background: unset;
    overflow-y: auto;
    border-radius: unset;
  }

  @media only screen and (max-width: 600px) {
    .universal-login-default .modal-wrapper {
      height: 100%;
      overflow-y: auto;
      max-width: unset;
    }

    .universal-login-default .modal {
      min-height: 100%;
    }
  }

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    .universal-login-default .modal-wrapper {
      max-width: unset;
    }
  }
`;

const ButtonExit = styled(CloseButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;

  &::after, &::before {
    background-color: rgba(67, 157, 176, 0.4);
  }
`;

const ModalTitle = styled(Title)`
  font-size: 2.4rem;
  margin-top: 6.2rem;

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    grid-template-columns: 1fr;
    margin-top: 6.2rem;
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    margin-top: 6.2rem;
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
  }
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 50rem;
  min-height: 30rem;
  color: white;
  color: #0F0C4A;
  padding: 4.6rem 4.4rem 4rem;
  border-radius: .8rem;
  position: relative;
  padding-bottom: 3.2px;
  /* background-color: #fff; */

  @media only screen and (max-width: 600px) {
    min-width: unset;
    min-height: unset;
    width: 100%;
    height: 100%;
    border-radius: unset;
    padding: 0 1.6rem;
  }

  @media only screen and (max-height: 425px) {
    border-radius: unset;
  }

  @media only screen and (orientation: landscape) {
    width: 100%;
    /* padding: 0 1.6rem; */
    padding-top: 0;
  }

  @media only screen and (orientation: landscape) and (max-width: 600px) {
    width: 100%;
    /* padding: 0 1.6rem; */
    padding-top: 0;
    border-radius: unset;
  }

  @media only screen and (orientation: landscape) and (max-width: 1000px) {
    width: 100%;
    /* padding: 0 1.6rem; */
    padding-top: 0;
  }


`;

const ModalBoxWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const LoginButton = styled(ButtonPrimary)`
  width: 100%;
  font-size: 1.4rem;
  margin-bottom: calc(4rem + 2.6rem);
  flex-grow: 1;

  @media only screen and (max-width: 600px) {
    margin-top: auto;
    margin-bottom: 5.5rem;
  }
`;

const ModalBackground = styled.div`
  width: 100%;
  height: calc(100% - 26px);
  z-index: -100;
  background-color: #fff;
  position: absolute;
  border-radius: .8rem;
  top: 0;
  left: 0;

  @media only screen and (max-width: 600px) {
    height: 100%;
    border-radius: 0;
  }

  @media only screen and (orientation: landscape) and (max-height: 425px) {
    height: 100%;
    border-radius: 0;
  }
`;
