# Using Universal-Login in a web application

Universal-Login has a Web3 provider implementation with out-of-the-box onboarding UI flow that can be easily integrated in any DApp.

## Usage example

### Web3

The only step required for Web3 is to swap out the provider. 

```javascript
import Web3 from 'web3';
import {ULWeb3Provider} from '@universal-login/web3';

const universalLogin = new ULWeb3Provider();
const web3 = new Web3(universalLogin);   
```

### Ethers

```javascript
import {providers, utils} from 'ethers';
import {ULWeb3Provider} from '@universal-login/web3';

const universalLogin = new ULWeb3Provider();
const provider = new providers.Web3Provider(universalLogin);

const wallet = universalLogin.create();

console.log(await wallet.getBalance())

const tx = await wallet.sendTransaction({
  to: '0x...',
  value: utils.parseEth('2'),
  gasToken: '0x...', // (optional) custom gas token to use for fees
})
```

## Universal-Login button

You can also provide a special Universal-Login for the user to access all of his wallet features:

```html
   <!-- In a navbar, header or other appropriate place -->
   <div id="univeral-login-button"></div>
```

## Wallet manipulation

Steps below are **optional**, if there are no wallets registered, a create/connect flow will be presented **automatically** on first transaction.

### Create new wallet

```javascript
universalLogin.create();
```

Will immediately trigger a create modal, if there isn't wallet present already.
The user can then choose their own ENS name, and a top-up method to pay for the wallet. 

### Connect to existing wallet

```javascript
universalLogin.connect('justyna.ethsimple.eth'); // pre-fill ENS name

universalLogin.connect(); // prompt the user to enter a name 
```
 
Will open a modal, allowing the user to connect to existing Universal-Login account.

## How it works

Universal-Login provider intercepts certain RPC methods such as `eth_SendTransaction`.
It translates them to meta-transactions which can then be signed with users private key and sent to the Relayer network.

The provider also bundles it's own React UI elements (create/connect modals). They are mouned in a separate React tree.
This makes it possible to use Universal-Login with any other UI framework (Vue, Angular, native, etc.) universally.
A div with id `univeral-login-root` will be automatically created inside the page's body tag.   
