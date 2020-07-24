import {expect} from 'chai';
import {parseDomain, isValidEnsNameElement, isValidEnsName} from '../../../src/core/utils/ens';

describe('UNIT: ENS', () => {
  describe('parseDomain', () => {
    it('simple', () => {
      expect(parseDomain('alex.mylogin.eth')).to.deep.eq(['alex', 'mylogin.eth']);
      expect(parseDomain('john.mylogin.eth')).to.deep.eq(['john', 'mylogin.eth']);
      expect(parseDomain('marek.universal-id.eth')).to.deep.eq(['marek', 'universal-id.eth']);
    });

    it('complex label', () => {
      expect(parseDomain('john.and.marek.universal-id.eth'))
        .to.deep.eq(['john', 'and.marek.universal-id.eth']);
    });

    it('empty label', () => {
      expect(parseDomain('universal-id.eth'))
        .to.deep.eq(['universal-id', 'eth']);
    });
  });

  describe('isValidEnsNameElement', () => {
    it('\'\'', () => {
      const ensNameElement = '';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('a', () => {
      const ensNameElement = 'a';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('abc', () => {
      const ensNameElement = 'abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('abc-abc', () => {
      const ensNameElement = 'abc-abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('abc--abc', () => {
      const ensNameElement = 'abc--abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('abc--abc--abc', () => {
      const ensNameElement = 'abc--abc--abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('a-c', () => {
      const ensNameElement = 'a-c';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('ab', () => {
      const ensNameElement = 'ab';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('abc-', () => {
      const ensNameElement = 'abc-';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('-abc', () => {
      const ensNameElement = '-abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('ABC', () => {
      const ensNameElement = 'ABC';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('123', () => {
      const ensNameElement = '123';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.true;
    });

    it('aBd3F5gggDD', () => {
      const ensNameElement = 'aBd3F5gggDD';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('_abc', () => {
      const ensNameElement = '_abc';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it('a^a%a&', () => {
      const ensNameElement = 'a^a%a&';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });

    it(' ', () => {
      const ensNameElement = ' ';
      const actalIsValid = isValidEnsNameElement(ensNameElement);
      expect(actalIsValid).to.be.false;
    });
  });

  describe('isValidEnsName', () => {
    const itValidatesEnsName = (ensName: string, result: boolean) => {
      it(`returns ${result} for ${ensName}`, () => {
        expect(isValidEnsName(ensName)).to.eq(result);
      });
    };

    itValidatesEnsName('jaaaa.mylogin.eth', true);
    itValidatesEnsName('jaaaa.mylogin.xyz', true);
    itValidatesEnsName('jaaaa.mylogin.test', true);
    itValidatesEnsName('jaaaa1234.mylogin.eth', true);
    itValidatesEnsName('jaaaa1234.myl-ogin.eth', true);
    itValidatesEnsName('j-4.mylogin.eth', true);
    itValidatesEnsName('j-j-4.mylogin.eth', true);
    itValidatesEnsName('jsjsj-4jsjks.mylogin.eth', true);
    itValidatesEnsName('jaaaa-4.mylogin.eth', true);
    itValidatesEnsName('jaaaa-4.mylogin.pl', true);
    itValidatesEnsName('jaaaa-4.mylogin.ethudud', true);
    itValidatesEnsName('jaaaa-4.mylogin.comcom', true);
    itValidatesEnsName('jaaaa.mylogin.', false);
    itValidatesEnsName('jj.mylogin.eth', false);
    itValidatesEnsName('jj-.mylogin.eth', false);
    itValidatesEnsName('-jj.mylogin.eth', false);
    itValidatesEnsName('jaaaa123_4.mylogin.eth', false);
    itValidatesEnsName('jaaaa123_&@@.mylogin.eth', false);
    itValidatesEnsName('jaaaa123.wrong__domain.eth', false);
    itValidatesEnsName('jaaaa123_4.mylogin.abc', false);
    itValidatesEnsName('jaaaa123_4.mylogin.something', false);
  });
});
