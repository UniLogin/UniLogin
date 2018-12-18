## Relayer

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

Learn more [here](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/RegisterENS.md)