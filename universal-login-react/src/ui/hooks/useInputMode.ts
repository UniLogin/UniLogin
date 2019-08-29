import {useState} from 'react';
import {InputModeWithAddress, DEFAULT_INPUT_MODE_WITH_ADDRESS, InputMode} from '../../core/models/InputMode';

export const useInputMode = () => {
  const [inputMode, setInputMode] = useState<InputModeWithAddress>(DEFAULT_INPUT_MODE_WITH_ADDRESS);

  return {
    inputMode,
    updateInputMode: (possibleAddresses: string[]) => {
      if (inputMode.mode === InputMode.KeyboardMode && possibleAddresses.length === 1) {
        setInputMode({mode: InputMode.PanelMode, address: possibleAddresses[0]});
      }
      else if (inputMode.mode === InputMode.PanelMode && possibleAddresses.length > 1) {
        setInputMode({mode: InputMode.KeyboardMode, address: undefined});
      }
    }
  };
};
