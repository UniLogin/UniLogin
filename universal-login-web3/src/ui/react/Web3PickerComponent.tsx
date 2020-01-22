import React, {useState} from 'react';
import {ModalWrapper, useProperty} from '@universal-login/react';
import {Property} from 'reactive-properties';
import {Web3ProviderFactory} from '../../models/Web3ProviderFactory';
import styled from 'styled-components';
import Web3ProviderComponent from './Web3ProviderComponent';

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
      <ModalBox>
        <ButtonExit onClick={() => hideModal()}>
          <ExitIcon></ExitIcon>
        </ButtonExit>
        <ModalTitle>Login with your wallet</ModalTitle>
        <ModalText>Please select your provider</ModalText>
        <ProviderList providerCount={factories.length}>
          {factories.map(({name, icon}) =>
            <Web3ProviderComponent selectedProvider={selectedProvider} name={name} icon={icon} key={name} onClick={() => setSelectedProvider(name)}/>,
          )}
        </ProviderList>
        <LoginButton onClick={() => setProvider(selectedProvider)}>Login</LoginButton>
      </ModalBox>
    </ModalWrapper>
    : null;
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

const ProviderList = styled.div<IProviderListProps>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 1.4rem;
  margin-top: 4rem;
  ${props => (props.providerCount === 2) && `
      grid-template-columns: repeat(2, 1fr);
  `}
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
