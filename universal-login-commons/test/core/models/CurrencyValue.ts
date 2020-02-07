import {CurrencyValue} from '../../../src/core/models/CurrencyValue';
import {expect} from 'chai';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../../src';

describe('UNIT: CurrencyValue', () => {
  it('can be created from wei', () => {
    const val = CurrencyValue.fromWei(13, ETHER_NATIVE_TOKEN.address);
    expect(val.value.toString()).to.equal('13');
    expect(val.address).to.equal(ETHER_NATIVE_TOKEN.address);
  });

  it('can be created from decimal number', () => {
    const val = CurrencyValue.fromDecimals(10.23, ETHER_NATIVE_TOKEN.address);
    expect(val.value.toString()).to.equal(utils.parseEther('10.23'));
    expect(val.address).to.equal(ETHER_NATIVE_TOKEN.address);
  });

  it('can be created from decimal string', () => {
    const val = CurrencyValue.fromDecimals('10.23', ETHER_NATIVE_TOKEN.address);
    expect(val.value.toString()).to.equal(utils.parseEther('10.23'));
    expect(val.address).to.equal(ETHER_NATIVE_TOKEN.address);
  });

  describe('arithmetic', () => {
    it('can be added', () => {
      const a = CurrencyValue.fromWei(13, ETHER_NATIVE_TOKEN.address);
      const b = CurrencyValue.fromWei(5, ETHER_NATIVE_TOKEN.address);
      const res = a.add(b);

      expect(res.value.toString()).to.equal('18');
      expect(a.address).to.equal(ETHER_NATIVE_TOKEN.address);
    });

    it('can be subtracted', () => {
      const a = CurrencyValue.fromWei(13, ETHER_NATIVE_TOKEN.address);
      const b = CurrencyValue.fromWei(5, ETHER_NATIVE_TOKEN.address);
      const res = a.sub(b);

      expect(res.value.toString()).to.equal('8');
      expect(a.address).to.equal(ETHER_NATIVE_TOKEN.address);
    });

    it('can be multiplied', () => {
      const a = CurrencyValue.fromWei(13, ETHER_NATIVE_TOKEN.address);
      const res = a.mul(2);

      expect(res.value.toString()).to.equal('26');
      expect(a.address).to.equal(ETHER_NATIVE_TOKEN.address);
    });

    it('can be divided', () => {
      const a = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const res = a.div(2);

      expect(res.value.toString()).to.equal('6');
      expect(a.address).to.equal(ETHER_NATIVE_TOKEN.address);
    });
  });

  describe('comparisons', () => {
    it('equals', () => {
      const a = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const b = CurrencyValue.fromWei(15, ETHER_NATIVE_TOKEN.address);
      const c = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);

      expect(a.equals(b)).to.equal(false);
      expect(a.equals(c)).to.equal(true);
    });

    it('gt', () => {
      const val = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);

      const smaller = CurrencyValue.fromWei(10, ETHER_NATIVE_TOKEN.address);
      const equal = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const larger = CurrencyValue.fromWei(15, ETHER_NATIVE_TOKEN.address);

      expect(val.gt(smaller)).to.equal(true);
      expect(val.gt(equal)).to.equal(false);
      expect(val.gt(larger)).to.equal(false);
    });

    it('gte', () => {
      const val = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);

      const smaller = CurrencyValue.fromWei(10, ETHER_NATIVE_TOKEN.address);
      const equal = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const larger = CurrencyValue.fromWei(15, ETHER_NATIVE_TOKEN.address);

      expect(val.gte(smaller)).to.equal(true);
      expect(val.gte(equal)).to.equal(true);
      expect(val.gte(larger)).to.equal(false);
    });

    it('lt', () => {
      const val = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);

      const smaller = CurrencyValue.fromWei(10, ETHER_NATIVE_TOKEN.address);
      const equal = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const larger = CurrencyValue.fromWei(15, ETHER_NATIVE_TOKEN.address);

      expect(val.lt(smaller)).to.equal(false);
      expect(val.lt(equal)).to.equal(false);
      expect(val.lt(larger)).to.equal(true);
    });

    it('lte', () => {
      const val = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);

      const smaller = CurrencyValue.fromWei(10, ETHER_NATIVE_TOKEN.address);
      const equal = CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address);
      const larger = CurrencyValue.fromWei(15, ETHER_NATIVE_TOKEN.address);

      expect(val.lte(smaller)).to.equal(false);
      expect(val.lte(equal)).to.equal(true);
      expect(val.lte(larger)).to.equal(true);
    });

    it('isZero', () => {
      expect(CurrencyValue.fromWei(12, ETHER_NATIVE_TOKEN.address).isZero()).to.equal(false);
      expect(CurrencyValue.fromWei(0, ETHER_NATIVE_TOKEN.address).isZero()).to.equal(true);
    });
  });
});
