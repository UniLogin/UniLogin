import {ObservedCurrency, TokensPrices} from '@universal-login/commons';
import {Sanitizer, asObject, asNumber, cast} from '@restless/sanitizers';
const cryptocompare = require('cryptocompare');

export async function getPrices(fromTokens: string[], toTokens: ObservedCurrency[]): Promise<TokensPrices> {
  const result = await cryptocompare.priceMulti(fromTokens, toTokens);

  const asTokenPrices = asRecord(fromTokens, asRecord(toTokens, asNumber));
  return cast(result, asTokenPrices);
}

function asRecord<K extends keyof any, V>(keys: K[], valueSanitizer: Sanitizer<V>): Sanitizer<Record<K, V>> {
  const schema: Record<K, Sanitizer<V>> = {} as any;
  for (const key of keys) {
    schema[key] = valueSanitizer;
  }
  return asObject(schema);
}
