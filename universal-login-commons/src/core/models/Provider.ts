import {asEnum} from '@restless/sanitizers';

const dialogsToDisable = ['WAIT_FOR_TRANSACTION'];

export const DialogsToDisable = {
  equals(dialog: string) {
    if(dialogsToDisable.includes(dialog)){
      return dialog;
    }
    throw new TypeError(`Invalid dialog: ${dialog}`);
  }
};

export const asDialogsToDisable = asEnum(dialogsToDisable as any, 'DialogsToDisable');
