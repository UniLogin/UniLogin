import {asEnum} from '@restless/sanitizers';

export type DialogsToDisable = 'WAIT_FOR_TRANSACTION';

export const asDialogsToDisable = asEnum<DialogsToDisable>(['WAIT_FOR_TRANSACTION'], 'DialogsToDisable');
