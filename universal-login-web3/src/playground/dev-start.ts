const {startDevAndCreateEnv, spawnProcess} = require('@unilogin/ops');

function runWebServer(vars: any) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start'], {env});
}

async function start() {
  const env = await startDevAndCreateEnv();
  runWebServer(env);
}

start().catch(console.error);
