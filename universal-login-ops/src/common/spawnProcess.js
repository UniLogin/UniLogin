const {spawn} = require('child_process');

function spawnProcess(name, command, args, options) {
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

module.exports = spawnProcess;
