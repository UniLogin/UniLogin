import {providers, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {ETHER_NATIVE_TOKEN, DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import {encodeDataForSetup, ProxyFactoryInterface, computeGnosisCounterfactualAddress} from '@universal-login/contracts';
import {ENSService} from './integration/ethereum/ENSService';

const jsonRpcUrl = 'https://kovan.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d'
const provider = new providers.JsonRpcProvider(jsonRpcUrl);
const ensAddress ='0x4Ca9B09FE1CDC2C4b0B489b6f92b24fd27feBB40'
const ensService = new ENSService(provider, ensAddress, '0xD79721fD1c007320cB443D4F7026b5B06f68ff97')
const privateKey = '0xddb8d4f291396074d92043a8af0c282eae3041d9eb8fee5c0a211421b2f07ed4';
const publicKey = utils.computeAddress(privateKey);
const ensName = 'aaaaaaaaa.poppularapp.test';
const gnosisSafe ='0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F'
const proxyFactory ='0x76e2cfc1f5fa8f6a5b3fc4c8f4788f0116861f9b'

const revertContractAddress = async (proxyFactory: string, gnosisSafe: string, provider: providers.Provider, setupData: string) => {
  const contractAddressData = ProxyFactoryInterface.functions.calculateCreateProxyWithNonceAddress.encode([gnosisSafe, setupData, 1]);
  const computeAddres = computeGnosisCounterfactualAddress(proxyFactory, 1, setupData, gnosisSafe);
  console.log('computedAddress', computeAddres)
  console.log('proxyFactory.address',proxyFactory)
  try {
    const response = await provider.call({to: proxyFactory, data: contractAddressData});
    console.log('here', {response})
  } catch(error) {
    console.log('here error', error)
  };
}

const getDeploymentData = async (ensName: string) => {
  return ensService.getRegistrarData(ensName);
}

const gasPrice = 24000000000

const setupDeployment = async (ensName: string) => {
  const ensRegistrarData = await getDeploymentData(ensName);
  const deployment = {
    owners: [publicKey],
    requiredConfirmations: 1,
    deploymentCallAddress: '0xD79721fD1c007320cB443D4F7026b5B06f68ff97',
    deploymentCallData: ensRegistrarData,
    fallbackHandler: AddressZero,
    paymentToken: ETHER_NATIVE_TOKEN.address,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: '0x6763ae279735330de79a73d2add09424927bc121'
  }
  return encodeDataForSetup(deployment);
}

const checkAddress = async () => {
  const setupData = await setupDeployment(ensName);
  revertContractAddress(proxyFactory, gnosisSafe, provider, setupData);
}


checkAddress();
// {"kind":"Deploying","wallet":{"name":"aaaaaaaaa.poppularapp.test","privateKey":"0xddb8d4f291396074d92043a8af0c282eae3041d9eb8fee5c0a211421b2f07ed4","contractAddress":"0x83d77769728b8284E8c211905f1A263A2672E9E7","deploymentHash":"0xb9a69244d6b04854272f2f5de88b1fecc328995707f3f9933318353c05b4a516"}}

// 0xa55b721ca9d5ba49c3b885188c7a356b367336526709d16af294e11b7cdb2408


//  owners: string[];
// requiredConfirmations: number;
// deploymentCallAddress: string;
// deploymentCallData: string;
// fallbackHandler: string;
// paymentToken: string;
// payment: string;
// refundReceiver: string;