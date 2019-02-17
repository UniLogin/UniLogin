import Create2Factory from 'universal-login-contracts/build/Create2Factory.json';
import Identity from 'universal-login-contracts/build/Identity.json';
import {deployContract} from 'ethereum-waffle';

async function deployFactory(deployWallet) {
  const contract = await deployContract(deployWallet, Create2Factory);

  const contractCode = "0x" + Identity.bytecode;
  console.log({contractCode})
  // const contractCode = "0x608060405234801561001057600080fd5b5060e98061001f6000396000f3fe6080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634e70b1dc14604e578063cd16ecbf146076575b600080fd5b348015605957600080fd5b50606060ad565b6040518082815260200191505060405180910390f35b348015608157600080fd5b5060ab60048036036020811015609657600080fd5b810190808035906020019092919050505060b3565b005b60005481565b806000819055505056fea165627a7a72305820e2300a4bd278fdad3e7f25b21cc0ceef81d2c73975fad45e73179bc4794f66ed0029";
  console.log(`Factory contract address: ${contract.address}`);
  // console.log('deployWallet.address', deployWallet.address, 'contractCode', contractCode);
  await contract.setContractCode(contractCode);
  console.log("calling contractCode")
  let code = await contract.contractCode();
  console.log('code', code)
  return contract.address;
}

module.exports = deployFactory;
