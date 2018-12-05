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


### Register ENS domain script

To register your domain, change `my-domain` in `registerDomain.js`
```js
  registrar.start('my-domain');
```
on your domain and run script from universal-login-relayer directory
```
  yarn register:domain
```

Learn more [here](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/RegisterENS.md)