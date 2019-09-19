const yargs = require('yargs');
import startDevelopment from '../dev/startDevelopment';
import deployToken from '../ops/deployToken';
import connectAndExecute from './connectAndExecute';
import deployMaster from '../ops/deployMaster';
import {connectAndDeployFactory} from '../ops/deployFactory';
import {sendFunds} from '../ops/sendFunds';
import {defaultDeployOptions, ETHER_NATIVE_TOKEN, DEV_DEFAULT_PRIVATE_KEY} from '@universal-login/commons';
import {registerTestDomain, registerEthDomain} from '../ENS/registerDomain';
import {registerENSName} from '../ENS/registerENSName';

const commandLineBuilder = yargs
  .usage('Usage: $0 [command] [options]')
  .option('nodeUrl', {
    describe: 'Address of json rpc node to connect to',
    default: ''
  })
  .option('privateKey', {
    describe: 'private key to be used for ',
    default: DEV_DEFAULT_PRIVATE_KEY
  })
  .option('gasPrice', {
    describe: 'gasPrice',
    default: defaultDeployOptions.gasPrice
  })
  .option('nonce', {
    describe: 'nonce for the transaction'
  })
  .command('start:dev', 'Starts development environment',
    () => {
    },
    (argv) => {
      startDevelopment({nodeUrl: argv.nodeUrl}).catch(console.error);
    })
  .command('deploy:token', 'Deploys a token',
    () => {},
    (argv) => {
      connectAndExecute(argv, deployToken).catch(console.error);
    })
  .command('deploy:master', 'Deploys wallet master contract',
    () => {},
    (argv) => {
      connectAndExecute(argv, deployMaster).catch(console.error);
    })
  .command('deploy:factory [walletContractAddress]', 'Deploys counterfactual factory contract',
    (yargs) => {
      yargs
        .positional('walletMaster', {
          describe: 'wallet master address'
        });
    },
    (argv) => {
      connectAndDeployFactory(argv).catch(console.error);
    })
  .command('send [to] [amount] [currency]', 'Sends funds to specified address',
    (yargs) => {
      yargs
        .positional('to', {
          describe: 'Target address of transfer'
        })
        .positional('amount', {
          type: 'string',
          describe: 'Amount to transfer'
        })
        .positional('currency', {
          describe: 'Currency of transfer',
          default: ETHER_NATIVE_TOKEN.symbol
        });
    },
    (argv) => {
      sendFunds(argv).catch(console.error);
    })
  .command('register:test:domain [label] [publicResolverAddress]', 'Registers test ENS domain',
    (yargs) => {
      yargs
        .positional('label', {
          type: 'string',
          describe: 'Label domain to register'
        })
        .positional('publicResolverAddress', {
          type: 'string',
          describe: 'Address of the public resolver'
        })
        .option('ensAddress', {
          describe: 'ENS address'
        });
    },
    (argv) => {
      registerTestDomain(argv).catch(console.error);
    })
  .command('register:ens:name [name] [domain]', 'Registers ENS name',
    (yargs) => {
      yargs
        .positional('name', {
          type: 'string',
          describe: 'Name to register'
        })
        .positional('domain', {
          type: 'string',
          describe: 'ENS domain'
        })
        .option('ensAddress', {
          describe: 'ENS address'
        });
    },
    (argv) => {
      registerENSName(argv).catch(console.error);
    })
  .command('register:eth:domain [label]', 'Registers .eth ENS domain',
    (yargs) => {
      yargs
        .positional('label', {
          type: 'string',
          describe: 'Label domain to register'
        })
        .option('ensAddress', {
          describe: 'ENS address'
        })
        .option('gasPrice', {
          describe: 'Gas price'
        });
    },
    (argv) => {
      registerEthDomain(argv).catch(console.error);
    })
  .demandCommand(1, 'No command provided');

module.exports = commandLineBuilder;
