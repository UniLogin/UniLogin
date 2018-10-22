import {spawn} from 'child_process';
import ethers from 'ethers';
import Ganache from 'ganache-core';
import {defaultAccounts, getWallets, deployContract} from 'ethereum-waffle';
import {ENSDeployer} from 'universal-login-relayer';
import Clicker from '../build/Clicker';
import Token from '../build/Token';
import {promisify} from 'util';
import TokenGrantingRelayer from '../src/TokenGrantingRelayer';


const chainSpec = {
  ensAddress: process.env.ENS_ADDRESS,
  chainId: 0
};

const config = Object.freeze({
  jsonRpcUrl: 'http://localhost:18545',
  port: 3311,
  privateKey: defaultAccounts[0].secretKey,
  chainSpec,
  ensRegistrars: {
    'mylogin.eth': {
      resolverAddress: process.env.ENS_RESOLVER1_ADDRESS,
      registrarAddress: process.env.ENS_REGISTRAR1_ADDRESS,
      privteKey: process.env.ENS_REGISTRAR1_PRIVATE_KEY
    },
    'universal-id.eth': {
      resolverAddress: process.env.ENS_RESOLVER2_ADDRESS,
      registrarAddress: process.env.ENS_REGISTRAR2_ADDRESS,
      privteKey: process.env.ENS_REGISTRAR2_PRIVATE_KEY
    },
    'popularapp.eth': {
      resolverAddress: process.env.ENS_RESOLVER3_ADDRESS,
      registrarAddress: process.env.ENS_REGISTRAR3_ADDRESS,
      privteKey: process.env.ENS_REGISTRAR3_PRIVATE_KEY
    }
  }
});


/* eslint-disable no-console */
class Deployer {
  constructor() {
    this.ganachePort = 18545;
    this.env = {};
  }

  ganacheUrl() {
    return `http://localhost:${this.ganachePort}`;
  }

  async startGanache() {
    const options = {accounts: defaultAccounts};
    const server = Ganache.server(options);
    const listenPromise = promisify(server.listen);
    await listenPromise(this.ganachePort);
    console.log(`Ganache up and running on ${this.ganacheUrl()}...`);
    this.provider = new ethers.providers.JsonRpcProvider(this.ganacheUrl(), chainSpec);
    const wallets = await getWallets(this.provider);
    this.deployer = wallets[wallets.length - 1];
    this.deployerPrivateKey = defaultAccounts[defaultAccounts.length - 1].secretKey;
  }

  async deployENS() {
    const deployer = new ENSDeployer(this.provider, this.deployerPrivateKey);
    await deployer.deployRegistrars(config.ensRegistrars);
    this.env = deployer.variables;
    this.env.ENS_DOMAIN_1 = 'mylogin.eth';
    this.env.ENS_DOMAIN_2 = 'universal-id.eth';
    this.env.ENS_DOMAIN_3 = 'popularapp.eth';
    this.env.JSON_RPC_URL = 'http://localhost:18545';
    this.config = Object.freeze({
      jsonRpcUrl: 'http://localhost:18545',
      port: 3311,
      privateKey: defaultAccounts[0].secretKey,
      chainSpec: {
        ensAddress: this.env.ENS_ADDRESS,
        chainId: 0
      },
      ensRegistrars: {
        [this.env.ENS_DOMAIN_1]: {
          resolverAddress: this.env.ENS_RESOLVER1_ADDRESS,
          registrarAddress: this.env.ENS_REGISTRAR1_ADDRESS,
          privteKey: this.env.ENS_REGISTRAR1_PRIVATE_KEY
        },
        [this.env.ENS_DOMAIN_2]: {
          resolverAddress: this.env.ENS_RESOLVER2_ADDRESS,
          registrarAddress: this.env.ENS_REGISTRAR2_ADDRESS,
          privteKey: this.env.ENS_REGISTRAR2_PRIVATE_KEY
        },
        [this.env.ENS_DOMAIN_3]: {
          resolverAddress: this.env.ENS_RESOLVER3_ADDRESS,
          registrarAddress: this.env.ENS_REGISTRAR3_ADDRESS,
          privteKey: this.env.ENS_REGISTRAR3_PRIVATE_KEY
        }
      }
    });
  }

  startRelayer() {
    this.relayer = new TokenGrantingRelayer(this.provider, this.config, this.deployerPrivateKey, this.tokenContract.address);
    this.env.RELAYER_URL = `http://localhost:${this.config.port}`;
    this.relayer.start();
  }

  async deployTokenContract() {
    this.tokenContract = await deployContract(this.deployer, Token);
    this.env.TOKEN_CONTRACT_ADDRESS = this.tokenContract.address;
  }

  async deployClickerContract() {
    const clickerContract = await deployContract(this.deployer, Clicker);
    this.env.CLICKER_CONTRACT_ADDRESS = clickerContract.address;
  }

  runWebServer() {
    const env = {...process.env, ...this.env};
    this.spawnProcess('web', 'yarn', ['start'], {env});
  }

  spawnProcess(name, command, args, options) {
    const child = spawn(command, args, options);
    child.stdout.on('data', (data) => {
      console.log(`${name}: ${data}`);
    });
    child.stderr.on('data', (data) => {
      console.log(`ERROR ${name}:  ${data}`);
    });
    child.on('close', (code) => {
      console.log(`${name} exited with code ${code}`);
    });
    return child;
  }

  async start() {
    console.log('Starting ganache...');
    await this.startGanache();
    console.log('Deploying ENS contracts...');
    await this.deployENS();
    console.log('Deploying token contract...');
    await this.deployTokenContract();
    console.log('Starting relayer...');
    await this.startRelayer();
    console.log('Deploying clicker contract...');
    await this.deployClickerContract();
    console.log('Preparing relayer...');
    await this.relayer.addHooks();
    console.log('Starting example app web server...');
    this.runWebServer();
  }
}

const deployer = new Deployer();
deployer.start().catch(console.error);

