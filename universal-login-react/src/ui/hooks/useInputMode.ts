import {useState} from 'react';
import {AddressFound, AddressFoundStatus} from '@universal-login/commons';
import {InputModeWithAddress, DEFAULT_INPUT_MODE_WITH_ADDRESS, InputMode} from '../../core/models/InputMode';

export const useInputMode = () => {
  const [inputMode, setInputMode] = useState<InputModeWithAddress>(DEFAULT_INPUT_MODE_WITH_ADDRESS);

  return {
    inputMode,
    updateInputMode: (newPossibleAddressFound: AddressFound) => {
      if (inputMode.mode === InputMode.KeyboardMode && newPossibleAddressFound.status === AddressFoundStatus.OneAddressFound) {
        setInputMode({mode: InputMode.PanelMode, address: newPossibleAddressFound.address});
      }
      else if (inputMode.mode === InputMode.PanelMode && newPossibleAddressFound.status === AddressFoundStatus.ManyAddressesFound) {
        setInputMode({mode: InputMode.KeyboardMode, address: undefined});
      }
    }
  };
};
