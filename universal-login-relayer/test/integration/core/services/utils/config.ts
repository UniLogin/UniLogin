import {expect} from 'chai';
import {getNodeEnv} from '../../../../../lib/core/utils/config';

describe('Config', () => {
  describe('getNodeEnv', () => {
    it('should return test if test node env', () => {
      process.env.NODE_ENV = 'test';
      expect(getNodeEnv()).to.eq('test');
    });

    it('should return development if no node env', () => {
      delete process.env.NODE_ENV;
      expect(getNodeEnv()).to.eq('development');
    });

    it('should return development if development node env', () => {
      process.env.NODE_ENV = 'development';
      expect(getNodeEnv()).to.eq('development');
    });
  });
});
