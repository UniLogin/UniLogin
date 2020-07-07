import {asString, asChecked} from '@restless/sanitizers';

const dialogsToDisable = ['WAIT_FOR_TRANSACTION', 'ERROR'];

export const asDialogsToDisable = asChecked(asString, dialog => dialogsToDisable.includes(dialog));
