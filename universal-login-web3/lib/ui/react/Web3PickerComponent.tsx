import React from 'react';
import {ModalWrapper, useProperty} from '@universal-login/react';
import {Property} from 'reactive-properties';

interface Web3PickerComponentProps {
  isVisibleProp: Property<boolean>,
  hideModal: () => void,
}

export const Web3PickerComponent = ({isVisibleProp, hideModal}: Web3PickerComponentProps) => {
  const isVisible = useProperty(isVisibleProp)
  return isVisible
    ? <ModalWrapper hideModal={hideModal}>
        Choose provider!
      </ModalWrapper>
    : null
};
