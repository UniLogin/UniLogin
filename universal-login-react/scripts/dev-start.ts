const {startDevelopment, createEnv, spawnProcess} = require('@unilogin/ops');
import Relayer from '@unilogin/relayer';

function runWebServer(vars: any) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start'], {env});
}

async function start() {
  const artifacts = await startDevelopment({relayerClass: Relayer});
  const env = createEnv(artifacts);
  runWebServer(env);
}

start().catch(console.error);
