const yargs = require('yargs');
import startDevelopment from '../dev/startDevelopment';
import deployToken from '../dev/deployToken';
import connectAndExecute from './connectAndExecute';

const commandLineBuilder = yargs
  .usage('Usage: $0 [command] [options]')
  .option('nodeUrl', {
    describe: 'Address of json rpc node to connect to',
    default: ''
  })
  .option('privateKey', {
    describe: 'private key to be used for '
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
  .demandCommand(1, 'No command provided');

module.exports = commandLineBuilder;
