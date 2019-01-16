export async function getDatabase(knex, databaseName) {
  return knex
    .select('*')
    .from('pg_database')
    .where({datname: databaseName});
}

export async function createDatabase(knex, databaseName) {
  return knex.raw(`CREATE DATABASE ${databaseName};`);
}
