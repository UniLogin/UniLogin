const {startDevelopment, createEnv, spawnProcess} = require('@unilogin/ops');
import Relayer from '@unilogin/relayer';

function runWebServer(vars: any) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start:playground'], {env});
}

async function start() {
  const artefacts = await startDevelopment({relayerClass: Relayer});
  const env = createEnv(artefacts);
  runWebServer(env);
}

start().catch(console.error);
