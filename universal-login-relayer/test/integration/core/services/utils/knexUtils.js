import {expect} from 'chai';
import {getNodeEnv, getKnexConfig, getKnex} from '../../../../../lib/core/utils/knexUtils';

describe('INT: Knex utils', () => {
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

  describe('getKnexConfig', () => {
    it('should return test config', () => {
      process.env.NODE_ENV = 'test';
      expect(getKnexConfig().connection.database).to.deep.eq('universal_login_relayer_test');
    });

    it('should return development config', () => {
      process.env.NODE_ENV = 'development';
      expect(getKnexConfig().connection.database).to.deep.eq('universal_login_relayer_development');
    });
  });

  describe('getKnex', () => {
    it('should return knex if development', () => {
      process.env.NODE_ENV = 'development';
      const knex = getKnex();
      expect(knex.connection().client.config.connection.database).to.eq('universal_login_relayer_development');
    });

    it('should return  knex', () => {
      process.env.NODE_ENV = 'test';
      const knex = getKnex();
      expect(knex.connection().client.config.connection.database).to.eq('universal_login_relayer_test');
    });
  });
});
