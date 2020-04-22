import React from 'react';
import styled from 'styled-components';

interface IWeb3ProviderProps {
  name: string;
  icon?: string;
  labelTop?: string;
  labelBottom?: string;
  selectedProvider: string;
  onClick: () => void;
}

interface IIndicatorProps {
  status: boolean;
}

interface IProviderButton {
  name: string;
  selectedProvider: string;
}

const isMetamaskPresent = () => !!(window as any).ethereum;

const ProviderSelect = ({name, icon, labelTop, labelBottom, selectedProvider, onClick}: IWeb3ProviderProps) =>
  <ProviderButton disabled={name === 'Metamask' && !isMetamaskPresent()} name={name} selectedProvider={selectedProvider} onClick={onClick}>
    {(labelTop) && <ProviderLabelTop>{labelTop}</ProviderLabelTop>}
    <ProviderIcon src={icon} alt={name + ' logo'}/>
    {(labelBottom) && <ProviderLabelBottom>{labelBottom}</ProviderLabelBottom>}
    {(name === 'Metamask') && <Indicator status={isMetamaskPresent()}/>}
  </ProviderButton>;

const Indicator: React.FunctionComponent<IIndicatorProps> = props => (props.status) ? <ProviderIndicatorGreen /> : <ProviderIndicatorRed />;

const ProviderButton = styled.button<IProviderButton>`
  background: #fff;
  border: 1px solid rgba(190, 207, 217, 0.6);
  border-radius: .4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.9rem 2.8rem 2.6rem 2.8rem;
  cursor: pointer;
  position: relative;
  font-family: 'HelveticaNeue', sans-serif;
  min-height: 88px;

  &:hover {
    box-shadow: 0px 10px 40px rgba(0, 131, 188, 0.12);
  }

  ${props => props.selectedProvider === props.name && `
  box-shadow: 0px 10px 40px rgba(0, 131, 188, 0.12);
  border: 1px solid rgba(8, 174, 197, 0.5);
  `};

  &:disabled {
    box-shadow: none;
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

const ProviderIndicatorGreen = styled.div`
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: .7rem;
  right: .7rem;
  border-radius: 50%;
  background: linear-gradient(91.66deg, #0ADBC2 0%, #07D1D1 100%);
`;

const ProviderIndicatorRed = styled.div`
  width: .8rem;
  height: .8rem;
  position: absolute;
  top: .7rem;
  right: .7rem;
  border-radius: 50%;
  background: red;
`;

const ProviderIcon = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

export default ProviderSelect;
