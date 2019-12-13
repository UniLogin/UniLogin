import React from 'react';
import {ModalWrapper, useProperty} from '@universal-login/react';
import {Property} from 'reactive-properties';
import '../styles/web3Picker.css';
import U from '../assets/U.svg';
import {Web3ProviderFactory} from '../../Web3ProviderFactory';

interface Web3PickerComponentProps {
  isVisibleProp: Property<boolean>;
  hideModal: () => void;
  customProviders: Web3ProviderFactory[];
  setProvider: (providerName: string) => void;
}

export const Web3PickerComponent = ({customProviders, isVisibleProp, hideModal, setProvider}: Web3PickerComponentProps) => {
  const isVisible = useProperty(isVisibleProp);

  return isVisible
    ? <ModalWrapper>
      <div className="modal-box">
        <h3 className="title-container">How would you like to connect to blockchain?</h3>
        <div className="providers-container">
          <>
            {customProviders.map(({name, icon}) =>
              <button key={name} className="logo-button" onClick={() => setProvider(name)}>
                <div className="logo-text">
                  {name}
                </div>
                <img src={U} />
              </button>,
            )}
          </>
        </div>
      </div>
    </ModalWrapper>
    : null;
};
