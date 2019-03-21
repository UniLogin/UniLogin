const yargs = require('yargs');
import startDevelopment from '../dev/startDevelopment';
import deployToken from '../dev/deployToken';
import connectAndExecute from './connectAndExecute';
import {sendFunds} from '../dev/sendFunds';
import {ETHER_NATIVE_TOKEN, DEV_DEFAULT_PRIVATE_KEY} from 'universal-login-commons';

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
  .option('to', {
    describe: 'Target address of transfer'
  })
  .option('currency', {
    describe: 'Currency of transfer',
    default: ETHER_NATIVE_TOKEN.symbol
  })
  .option('amount', {
    describe: 'Amount of transfer',
    string: true
  })
  .command('start:dev', 'Starts development environment',
    () => {
    },
    (argv) => {
      startDevelopment(argv.nodeUrl).catch(console.error);
    })
  .command('deploy:token', 'Deploys a test token',
    () => {},
    (argv) => {
      connectAndExecute(argv.nodeUrl, argv.privateKey, deployToken).catch(console.error);
    })
  .command('send', 'Sends funds to specified address',
    () => {},
    (argv) => {
      sendFunds(argv).catch(console.error);
    })
  .demandCommand(1, 'No command provided');

module.exports = commandLineBuilder;
