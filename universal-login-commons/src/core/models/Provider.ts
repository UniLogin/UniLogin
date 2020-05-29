import {asEnum} from '@restless/sanitizers';

export type DialogsToDisable = 'WAIT_FOR_TRANSACTION';

export const DialogsToDisable = {
  toModuleName(dialog: DialogsToDisable): string {
    switch (dialog) {
      case 'WAIT_FOR_TRANSACTION':
        return 'WAIT_FOR_TRANSACTION';
      default:
        throw new TypeError(`Invalid dialog: ${dialog}`);
    }
  },
  toStringValueOfModuleName(dialog: DialogsToDisable): string {
    switch (dialog) {
      case 'WAIT_FOR_TRANSACTION':
        return 'WAIT_FOR_TRANSACTION';
      default:
        throw new TypeError(`Invalid dialog: ${dialog}`);
    }
  },
  equals(left: DialogsToDisable, right: DialogsToDisable) {
    return DialogsToDisable.toModuleName(left) === DialogsToDisable.toModuleName(right);
  },
};

export const asDialogsToDisable = asEnum<DialogsToDisable>(['WAIT_FOR_TRANSACTION', 'WAIT_FOR_TRANSACTION'], 'DialogsToDisable');
