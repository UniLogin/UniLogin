# Relayer

## Prerequisites
To run relayer in development mode and to run tests you need to have Postgres installed and running.
You also need to have `universal_login_relayer_development` database created.

You can do it in your favorite database UI, or from `psql`:
```sh
psql
> create database universal_login_relayer_development;
> \q
```

Then you need to migrate database:
```sh
yarn setup:db
```

## Starting

To start relayer programmatically:

```js
import Relayer from '../../lib/relayer/relayer';
const privateKey = '0x.....';
const relayer = new Relayer('https://etherscan.io/{yourapikey}', privateKey);
relayer.start();
```

To stop relayer:

```js
relayer.stop();
```

To start relayer from command line:

```sh
npx start-relayer [config-file]
```

Where config file is a JSON file in the following format:

```js
{
  privateKey: '0x123...123',
  port: 3311
}
```

Default port is `3311`, `privateKey` is the only required field.


### ENS Register scripts

To register ENS domain, in `universal-login-relayer` directory type:
```
  yarn register:domain my-domain tld
```

where:
* `my-domain` is domain, that you want to register
* `tld` is top level domain, for example: `eth` or on testnets: `test`


To register ENS name, in `universal-login-relayer` directory type:
```
  yarn register:name name my-domain.test
```

where:
* `name` is name, that you want to register
* `my-domain.test` is existing domain

Learn more [here](https://github.com/UniversalLogin/UniversalLoginSDK/blob/master/universal-login-relayer/RegisterENS.md)