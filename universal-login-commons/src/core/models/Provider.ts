import {asEnum} from '@restless/sanitizers';

export type Dialogs = 'WAITING_FOR_TRANSACTION' | 'WAITING_FOR_TRANSACTION';

export const Dialogs = {
  toModuleName(dialog: Dialogs): string {
    switch (dialog) {
      case 'WAITING_FOR_TRANSACTION':
        return 'WAITING_FOR_TRANSACTION';
      default:
        throw new TypeError(`Invalid dialog: ${dialog}`);
    }
  },
  toStringValueOfModuleName(dialog: Dialogs): string {
    switch (dialog) {
      case 'WAITING_FOR_TRANSACTION':
        return 'WAITING_FOR_TRANSACTION';
      default:
        throw new TypeError(`Invalid dialog: ${dialog}`);
    }
  },
  equals(left: Dialogs, right: Dialogs) {
    return Dialogs.toModuleName(left) === Dialogs.toModuleName(right);
  },
};

export const asDialogs = asEnum<Dialogs>(['WAITING_FOR_TRANSACTION', 'WAITING_FOR_TRANSACTION'], 'Dialogs')