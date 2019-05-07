export interface KnexConfig {
  client: string;
  connection: {
    database: string;
    user: string;
    password: string;
  } | string;
  migrations?: {
    tableName?: string;
    directory?: string;
  };
}
