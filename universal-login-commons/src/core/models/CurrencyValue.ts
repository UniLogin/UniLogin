import {utils} from 'ethers';
import {ensure, addressEquals} from '../..';
import {BigNumberish} from 'ethers/utils';

export class CurrencyValue<T extends string = string> {
  readonly address: string;
  readonly value: utils.BigNumber;

  constructor(
    wei: utils.BigNumber,
    address: T,
  ) {
    this.address = address.toLowerCase();
    this.value = wei;
  }

  static fromWei<T extends string>(value: utils.BigNumberish, address: T) {
    return new CurrencyValue(utils.bigNumberify(value), address);
  }

  static fromDecimals<T extends string>(value: string | number, address: T) {
    return new CurrencyValue(utils.parseEther(value.toString()), address);
  }

  add(other: CurrencyValue<T>) {
    ensure(addressEquals(this.address, other.address), TypeError);
    return new CurrencyValue(this.value.add(other.value), this.address);
  }

  sub(other: CurrencyValue<T>) {
    ensure(addressEquals(this.address, other.address), TypeError);
    return new CurrencyValue(this.value.sub(other.value), this.address);
  }

  mul(value: BigNumberish) {
    return new CurrencyValue(this.value.mul(value), this.address);
  }

  div(value: BigNumberish) {
    return new CurrencyValue(this.value.div(value), this.address);
  }

  equals(other: CurrencyValue<T>) {
    return this.value.eq(other.value) && addressEquals(this.address, other.address);
  }

  gt(other: CurrencyValue<T>) {
    return this.value.gt(other.value);
  }

  lt(other: CurrencyValue<T>) {
    return this.value.lt(other.value);
  }

  gte(other: CurrencyValue<T>) {
    return this.value.gte(other.value);
  }

  lte(other: CurrencyValue<T>) {
    return this.value.lte(other.value);
  }

  isZero() {
    return this.value.eq(0);
  }

  toWei() {
    return this.value;
  }

  toDecimals() {
    return utils.formatEther(this.value);
  }

  toJSON() {
    return {
      value: this.value.toString(),
      address: this.address,
    };
  }
}
