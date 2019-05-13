const yargs = require('yargs');
import startDevelopment from '../dev/startDevelopment';
import deployToken from '../ops/deployToken';
import connectAndExecute from './connectAndExecute';
import deployMaster from '../ops/deployMaster';
import {sendFunds} from '../ops/sendFunds';
import {ETHER_NATIVE_TOKEN, DEV_DEFAULT_PRIVATE_KEY} from '@universal-login/commons';

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
  .command('start:dev', 'Starts development environment',
    () => {
    },
    (argv) => {
      startDevelopment({nodeUrl: argv.nodeUrl}).catch(console.error);
    })
  .command('deploy:token', 'Deploys a token',
    () => {},
    (argv) => {
      connectAndExecute(argv.nodeUrl, argv.privateKey, deployToken).catch(console.error);
    })
  .command('deploy:master', 'Deploys wallet master contract',
    () => {},
    (argv) => {
      connectAndExecute(argv.nodeUrl, argv.privateKey, deployMaster).catch(console.error);
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
        })
    },
    (argv) => {
      sendFunds(argv).catch(console.error);
    })
  .demandCommand(1, 'No command provided');

module.exports = commandLineBuilder;
