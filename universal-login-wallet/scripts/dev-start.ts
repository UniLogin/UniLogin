const {startDevelopment, createEnv, spawnProcess} = require('@unilogin/ops');

function runWebServer(vars: any) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start'], {env});
}

async function start() {
  const artifacts = await startDevelopment();
  const env = createEnv(artifacts);
  runWebServer(env);
}

start().catch(console.error);
