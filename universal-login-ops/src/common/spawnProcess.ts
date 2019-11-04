const spawn = require('cross-spawn');

const spawnProcess = (name: string, command: string, args: string[], options: object) => {
  const child = spawn(command, args, {...options, stdio: 'inherit'});
  child.on('close', (code: string) => {
    console.log(`${name} exited with code ${code}`);
  });
  return child;
};

export default spawnProcess;
