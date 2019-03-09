import {deployContract} from 'ethereum-waffle';
import Clicker from '../build/Clicker';
import {startDevelopment, createEnv, spawnProcess} from 'universal-login-ops';

async function deployClickerContract(deployWallet) {
  const clickerContract = await deployContract(deployWallet, Clicker);
  console.log(`     Clicker address: ${clickerContract.address}`);
  return clickerContract.address;
}

function runWebServer(vars) {
  const env = {...process.env, ...vars};
  spawnProcess('web', 'yarn', ['start'], {env});
}

async function start() {
  const artefacts = await startDevelopment();
  const env = createEnv(artefacts);
  env.CLICKER_CONTRACT_ADDRESS = await deployClickerContract(artefacts.deployWallet);
  console.log();
  runWebServer(env);
}

start().catch(console.error);
