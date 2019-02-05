const yargs = require('yargs');
const startDevelopment = require('../dev/startDevelopment');

const commandLineBuilder = yargs
  .usage('Usage: $0 start:dev ')
  .option('nodeUrl', {
    describe: 'connects to existing json rpc node on port 18545'
  })
  .command('start:dev', 'start development environment',
    () => {
    },
    (argv) => {
      startDevelopment(argv.nodeUrl)
        .catch(console.error);
    })
  .demandCommand(1, 'No command provided');

module.exports = commandLineBuilder;
