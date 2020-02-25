import {asAnyOf, Sanitizer} from '@restless/sanitizers';
import {asExactly} from './asExactly';

export type LiteralType = string | number | boolean | null | undefined

type NonEmptyArray<T> = [T, ...T[]]

export const asEnum = <T extends LiteralType>(variants: NonEmptyArray<T>, expected: string): Sanitizer<T> =>
  asAnyOf(variants.map(asExactly) as NonEmptyArray<Sanitizer<T>>, expected)
