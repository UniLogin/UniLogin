import {expect} from 'chai';
import {toWords, generateBackupCode, fromWords, getSyllables, fromBase} from '../../../lib/core/utils/generateBackupCodes';
import {utils} from 'ethers';
import range from 'lodash.range';

const {bigNumberify} = utils;

describe('Daefen', () => {
  describe('getSyllables', () => {
    const syllables = getSyllables();

    it('Length equal 3456', () => {
      expect(syllables).length(3456);
    });

    it('vowel+consonant', () => {
      expect(syllables[0]).to.eq('ab');
      expect(syllables[1]).to.eq('ac');
      expect(syllables[17]).to.eq('az');
      expect(syllables[107]).to.eq('yz');
    });

    it('consonant+vowel', () => {
      expect(syllables[108]).to.eq('ba');
      expect(syllables[114]).to.eq('ca');
      expect(syllables[116]).to.eq('ci');
      expect(syllables[215]).to.eq('zy');
    });

    it('consonant+vowel+vowel', () => {
      expect(syllables[216]).to.eq('baa');
      expect(syllables[221]).to.eq('bay');
      expect(syllables[227]).to.eq('bey');
      expect(syllables[263]).to.eq('cey');
      expect(syllables[863]).to.eq('zyy');
    });

    it('consonant+vowel+consonant', () => {
      expect(syllables[864]).to.eq('bab');
      expect(syllables[881]).to.eq('baz');
      expect(syllables[882]).to.eq('beb');
      expect(syllables[972]).to.eq('cab');
      expect(syllables[2807]).to.eq('zyz');
    });

    it('vowel+consonant+vowel', () => {
      expect(syllables[2808]).to.eq('aba');
      expect(syllables[2809]).to.eq('abe');
      expect(syllables[2814]).to.eq('aca');
      expect(syllables[2916]).to.eq('eba');
      expect(syllables[3455]).to.eq('yzy');
    });
  });

  describe('fromBase', () => {
    it('for number equal 0', () => {
      expect(fromBase(bigNumberify(0), bigNumberify(2))).to.be.deep.eq([0]);
      expect(fromBase(bigNumberify(0), bigNumberify(4))).to.be.deep.eq([0]);
      expect(fromBase(bigNumberify(0), bigNumberify(10))).to.be.deep.eq([0]);
    });

    describe('for value greater than base', () => {
      for (const value of [1, 2, 4, 5, 7, 9, 10, 15, 100]) {
        it(`Value ${value}, base: ${value + 1}`, () => {
          const asBigNumber = bigNumberify(value);
          expect(fromBase(asBigNumber, asBigNumber.add(1))).to.be.deep.eq([value]);
        });
      }
    });

    it('for base equal 2', () => {
      const base = bigNumberify(2);
      expect(fromBase(bigNumberify(2), base)).to.be.deep.eq([1, 0]);
      expect(fromBase(bigNumberify(3), base)).to.be.deep.eq([1, 1]);
      expect(fromBase(bigNumberify(8), base)).to.be.deep.eq([1, 0, 0, 0]);
    });
  });

  describe('toWords', () => {
    it('Single syllable', () => {
      expect(toWords(bigNumberify(0))).to.eq('Ab');
      expect(toWords(bigNumberify(1))).to.eq('Ac');
      expect(toWords(bigNumberify(1000))).to.eq('Cen');
      expect(toWords(bigNumberify(3455))).to.eq('Yzy');
    });

    it('Two syllables', () => {
      expect(toWords(bigNumberify(3456))).to.eq('Acab');
      expect(toWords(bigNumberify(3457))).to.eq('Acac');
      expect(toWords(bigNumberify(6912))).to.eq('Adab');
      expect(toWords(bigNumberify(11943935))).to.eq('Yzyyzy');
    });

    it('More syllables', () => {
      expect(toWords(bigNumberify(11943936))).to.eq('Acab Ab');
    });

    it('Max allowed number in input 2^53-1 passed as number', () => {
      expect(toWords(bigNumberify(9007199254740991))).to.eq('Omkeu Ugekum Ope');
    });

    it('Bigger than Number.MAX_VALUE', () => {
      expect(toWords(bigNumberify(`1${'0'.repeat(309)}`))).to.match(/As Owauda Cibime Za Nagciv ([A-Z][a-z]+ )*Villah Ywefui Ryiodo Egu/);
    });

    it('no collision at 10^309 and 10^309+1', () => {
      const bigNumber = bigNumberify(`1${'0'.repeat(309)}`);
      expect(toWords(bigNumber)).to.not.eq(toWords(bigNumber.add(1)));
    });

    it('no collision at even at 10^18', () => {
      const bigNumber = '1000000000000000000';
      expect(toWords(bigNumberify(bigNumber))).not.to.eq(toWords(bigNumberify(bigNumber).add(1)));
    });
  });

  describe('fromWords', () => {
    it('Single syllable', () => {
      expect(fromWords('Ab')).to.eq(0);
      expect(fromWords('Ac')).to.eq(bigNumberify(1));
      expect(fromWords('Cen')).to.eq(bigNumberify(1000));
      expect(fromWords('Yzy')).to.eq(bigNumberify(3455));
    });

    it('Two syllables', () => {
      expect(fromWords('Acab')).to.eq(bigNumberify(3456));
      expect(fromWords('Acac')).to.eq(bigNumberify(3457));
      expect(fromWords('Adab')).to.eq(bigNumberify(6912));
      expect(fromWords('Yzyyzy')).to.eq(bigNumberify(11943935));
    });

    it('More syllables', () => {
      expect(fromWords('Acab Ab')).to.eq(bigNumberify(11943936));
    });

    it('Max safe integer: 2^53-1', () => {
      expect(fromWords('Omkeu Ugekum Ope')).to.eq(bigNumberify(9007199254740991));
    });

    it('2^53', () => {
      expect(fromWords('Omkeu Ugekum Opi')).to.eq(bigNumberify('9007199254740992'));
    });

    it('Bigger than 2^53', () => {
      expect(fromWords('Omkeu Ugekum Opo')).to.be.eq(bigNumberify('9007199254740993'));
    });

    it('2^64', () => {
      expect(fromWords('Iches Afygei Mojciv')).to.be.eq(bigNumberify('18446744073709551615'));
      expect(fromWords('Iches Afygei Mojciw')).to.be.eq(bigNumberify('18446744073709551616'));
      expect(fromWords('Iches Afygei Mojciz')).to.be.eq(bigNumberify('18446744073709551617'));
    });

    it('2^128', () => {
      expect(fromWords('Gysohy Koaraf Epokuw Gopwud Naprom Haf')).to.be.eq(bigNumberify('340282366920938463463374607431768211455'));
      expect(fromWords('Gysohy Koaraf Epokuw Gopwud Naprom Hag')).to.be.eq(bigNumberify('340282366920938463463374607431768211456'));
      expect(fromWords('Gysohy Koaraf Epokuw Gopwud Naprom Hah')).to.be.eq(bigNumberify('340282366920938463463374607431768211457'));
    });
  });

  describe('fromWord and toWords are reversible', () => {
    const values = range(1, 32)
      .map((value) => bigNumberify(2).pow(bigNumberify(value * 8)));
    for (const value of values) {
      it(`${value}`, () => {
        expect(fromWords(toWords(value))).to.deep.eq(value);
      });
    }
  });

  it(`Unexpected overflow`, () => {
    const value = bigNumberify(2).pow(bigNumberify(64));
    expect(fromWords(toWords(value))).to.deep.eq(value);
  });

  describe('generateBackupCode', () => {
    it('(0,0)', () => {
      expect(generateBackupCode(bigNumberify(0), bigNumberify(0))).to.eq('ab-ab');
    });

    it('(0,128)', () => {
      expect(generateBackupCode(bigNumberify(0), bigNumberify('340282366920938463463374607431768211456'))).to.eq('ab-gysohy-koaraf-epokuw-gopwud-naprom-hag');
    });

    it('no collisions for 2^128 and 2^128-1', () => {
      const random1 = bigNumberify('340282366920938463463374607431768211456');
      const random2 = bigNumberify('340282366920938463463374607431768211455');
      expect(generateBackupCode(random1, random1)).not.to.eq(generateBackupCode(random2, random2));
    });

    it('no collisions for 10^30 and 10^31', () => {
      const random1 = bigNumberify('1000000000000000000000000000000');
      const random2 = bigNumberify('10000000000000000000000000000000');
      expect(generateBackupCode(random1, random1)).not.to.eq(generateBackupCode(random2, random2));
    });
  });
});
