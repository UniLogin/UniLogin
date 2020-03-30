import {expect} from 'chai';
import {ValueRounder} from '../../../src';

describe('UNIT: valueRounder', () => {
  describe('Ceil', () => {
    it('value is \'\'', () => {
      expect(() => ValueRounder.ceil((''))).throws('String is not a number');
    });

    it('value is not a number', () => {
      expect(() => ValueRounder.ceil('bbb', 3)).throws('String is not a number');
    });

    it('round 1.0001 to 1.001', () => {
      expect(ValueRounder.ceil('1.0001', 3)).to.be.eq('1.001');
    });

    it('round 0.099999 to 0.1', () => {
      expect(ValueRounder.ceil('0.099999', 3)).to.be.eq('0.1');
    });

    it('round 123.9981 to 123.999', () => {
      expect(ValueRounder.ceil('123.9981', 3)).to.be.eq('123.999');
    });

    it('round 123121211212.99812121 to 123121211212.999', () => {
      expect(ValueRounder.ceil('123121211212.99812121', 3)).to.be.eq('123121211212.999');
    });

    it('round 1.9981212111111111111111111111111111 to 1.999', () => {
      expect(ValueRounder.ceil('1.9981212111111111111111111111111111', 3)).to.be.eq('1.999');
    });
  });

  describe('Floor', () => {
    it('value is \'\'', () => {
      expect(() => ValueRounder.floor((''))).throws('String is not a number');
    });

    it('value is not a number', () => {
      expect(() => ValueRounder.floor(('bbb'))).throws('String is not a number');
    });

    it('round 123.9991 to 123.999', () => {
      expect(ValueRounder.floor('123.9991', 3)).to.be.eq('123.999');
    });

    it('round 0.99999999 to 0.999', () => {
      expect(ValueRounder.floor('0.99999999', 3)).to.be.eq('0.999');
    });

    it('round 0.1 to 0.1', () => {
      expect(ValueRounder.floor('0.1')).to.be.eq('0.1');
    });

    it('round 123121211212.99812121 to 123121211212.999', () => {
      expect(ValueRounder.floor('123121211212.99812121', 3)).to.be.eq('123121211212.998');
    });

    it('round 1.9981212111111111111111111111111111 to 1.999', () => {
      expect(ValueRounder.floor('1.9981212111111111111111111111111111', 3)).to.be.eq('1.998');
    });
  });
});
