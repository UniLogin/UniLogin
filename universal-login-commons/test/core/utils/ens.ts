import {expect} from 'chai';
import {parseDomain, isValidEnsNameElement} from '../../../lib/core/utils/ens';

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
        it(`''`, () => {
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
});
