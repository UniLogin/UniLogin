# Register ENS domain

```js
  const label = 'my-domain';
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(`${label}.test`);
```
On the Rinkeby testnet, only the .test top level domain is supproted.

## Get ENS address
For Rinkeby: 

```
  ensAddress = '0xe7410170f87102df0055eb195163a03b7f2bff4a'
```
## Get test registrar 

```js
  const testRegistrarAddress = await this.ens.owner(utils.namehash('test'));
  const testRegistrar = new Contract(testRegistrarAddress, TestRegistrar.interface, this.deployer);
```
Note, that on the Rinkeby testnet, there is no FIFSRegistrar, which is on mainnet. There is only TestRegistrar. 

## Finally you can register your domain

```js
  await this.waitToBeMined(await this.testRegistrar.register(labelHash, this.deployer.address));
```
Now you are this domain owner. To check it:
```js
  address = await this.ens.owner(node) 
```
`address` should be yours. 

## Set Resolver

First, you need to deploy Resolver, or you can use existing. For example Rinkeby testnet has public resolver:
```
  publicResolverAddress = '0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc'
```

Now you can set this resolver as your domain's resolver: 
```js
  await this.waitToBeMined(await this.ens.setResolver(node, this.publicResolver.address));
```

## Get Registrar
Deploy Registrar contract:
```js
  const registrarAddress = await this.waitToBeMined(await this.deployer.sendTransaction(deployFIFSRegistrarContract));
```
Finally set this Registrar as your domain's owner:
```js
  await this.ens.setOwner(node, registrarAddress);
```

