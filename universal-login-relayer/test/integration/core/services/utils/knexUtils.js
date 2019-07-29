import {expect} from 'chai';
import {getKnex} from '../../../../../lib/core/utils/knexUtils';

describe('INT: Knex utils', () => {
  describe('getKnex', () => {
    it('should return knex if development', () => {
      process.env.NODE_ENV = 'development';
      const knex = getKnex();
      expect(knex.connection().client.config.connection.database).to.eq('universal_login_relayer_development');
    });

    it('should return knex', () => {
      process.env.NODE_ENV = 'test';
      const knex = getKnex();
      expect(knex.connection().client.config.connection.database).to.eq('universal_login_relayer_test');
    });
  });
});
