import {ensure, Choose} from '@unilogin/commons';
import {WalletState} from '../models/WalletService';
import {InvalidWalletState} from './errors';

type Kind = WalletState['kind'];

export function ensureKind <A extends Kind>(state: WalletState, a: A): asserts state is Choose<WalletState, A>;
export function ensureKind <A extends Kind, B extends Kind>(state: WalletState, a: A, b: B): asserts state is Choose<WalletState, A | B>;
export function ensureKind <A extends Kind, B extends Kind, C extends Kind>(state: WalletState, a: A, b: B, c: C): asserts state is Choose<WalletState, A | B | C>;
export function ensureKind <A extends Kind, B extends Kind, C extends Kind, D extends Kind>(state: WalletState, a: A, b: B, c: C, d: D): asserts state is Choose<WalletState, A | B | C | D>;
export function ensureKind <A extends Kind, B extends Kind, C extends Kind, D extends Kind, E extends Kind>(state: WalletState, a: A, b: B, c: C, d: D, e: E): asserts state is Choose<WalletState, A | B | C | D | E>;

export function ensureKind(state: WalletState, ...kinds: Kind[]) {
  ensure(kinds.includes(state.kind), InvalidWalletState, kinds.join(' or '), state.kind);
}
