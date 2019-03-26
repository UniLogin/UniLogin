const {startDevelopment, createEnv, spawnProcess} = require('universal-login-ops');
import Relayer from 'universal-login-relayer';

function runWebServer(vars: any) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start'], {env});
}

async function start() {
  const artefacts = await startDevelopment({relayerClass: Relayer});
  const env = createEnv(artefacts);
  runWebServer(env);
}

start().catch(console.error);
