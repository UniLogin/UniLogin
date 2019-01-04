import {RelayerUnderTest} from 'universal-login-relayer/build';
import {createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import path from 'path';

const knexConfig = {
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_test',
    user:     'postgres',
    password: ''
  },
  migrations: {
    directory: path.join(__dirname, '../../../universal-login-relayer/migrations'),
    tableName: 'knex_migrations'
  }
};

export default async function setupSdk(givenProvider = createMockProvider()) {
  const relayer = await RelayerUnderTest.createPreconfigured(givenProvider, knexConfig);
  await relayer.database.migrate.latest({directory: path.join(__dirname, '../../../universal-login-relayer/migrations')});
  await relayer.start();
  const {provider} = relayer;
  const sdk = new UniversalLoginSDK(relayer.url(), provider);
  return {sdk, relayer, provider};
}
