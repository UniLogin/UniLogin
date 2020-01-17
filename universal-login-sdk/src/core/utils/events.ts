import {WalletContractInterface, GnosisSafeInterface} from '@universal-login/contracts';
import {Log} from 'ethers/providers';
import {WalletEventArgs, WalletEventType} from '../models/events';

export const eventInterface = {...WalletContractInterface.events, ...GnosisSafeInterface.events};

export function parseArgs(type: WalletEventType, event: Log): WalletEventArgs {
  if (event.topics[0] === eventInterface[type].topic) {
    const args = WalletContractInterface.parseLog(event);
    const {key} = args.values;
    return {key};
  }
  throw new TypeError(`Not supported event with topic: ${event.topics[0]}`);
}

export function parseArgsGnosis(type: WalletEventType, event: Log): WalletEventArgs {
  if (event.topics[0] === eventInterface[type].topic) {
    const args = GnosisSafeInterface.parseLog(event);
    const {owner} = args.values;
    return {key: owner};
  }
  throw new TypeError(`Not supported event with topic: ${event.topics[0]}`);
}
