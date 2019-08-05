const knex = require('knex');
import clonedeep from 'lodash.clonedeep';

async function getDatabase(connection, databaseName) {
  return connection
    .select('*')
    .from('pg_database')
    .where({datname: databaseName});
}

async function createDatabase(connection, databaseName) {
  return connection.raw(`CREATE DATABASE ${databaseName};`);
}

const stripDatabaseFromConfig = (config) => {
  const result = clonedeep(config);
  result.connection.database = 'postgres';
  return result;
};

async function ensureDatabaseExist(databaseConfig) {
  const connection = knex(stripDatabaseFromConfig(databaseConfig));
  const databaseName = databaseConfig.connection.database;
  const database = await getDatabase(connection, databaseName);
  if (!database[0]) {
    console.log(`No database detected. Creating '${databaseName}'...`);
    await createDatabase(connection, databaseName);
  }
  await connection.destroy();
}

module.exports = ensureDatabaseExist;
