const TestContract = artifacts.require("TestContract");
const Create2Factory = artifacts.require("Create2Factory");
const contractCode = "0x608060405234801561001057600080fd5b5060e98061001f6000396000f3fe6080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634e70b1dc14604e578063cd16ecbf146076575b600080fd5b348015605957600080fd5b50606060ad565b6040518082815260200191505060405180910390f35b348015608157600080fd5b5060ab60048036036020811015609657600080fd5b810190808035906020019092919050505060b3565b005b60005481565b806000819055505056fea165627a7a72305820e2300a4bd278fdad3e7f25b21cc0ceef81d2c73975fad45e73179bc4794f66ed0029"
salt = web3.utils.sha3('0x01')
contract('Create2', (accounts) => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const Create2FactoryInstance = await Create2Factory.deployed();
    let tx = await Create2FactoryInstance.setContractCode(contractCode, {from:accounts[0]})
    
    let addr1 = await Create2FactoryInstance.computeContractAddress(salt, accounts[0])
    let msgHash = web3.utils.soliditySha3(Create2FactoryInstance.address, salt)
    const signature = await web3.eth.sign(msgHash, accounts[0])
  
    let balance1 = await web3.eth.getBalance(addr1)
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: addr1,
      value: '1000000000000000'
    })

    let balance2 = await web3.eth.getBalance(addr1)
    console.log({balance1, balance2})
    assert.equal(false, await Create2FactoryInstance.isContract(addr1))

    await Create2FactoryInstance.deployContract(accounts[0],salt, signature, {from:accounts[0]})
    let addr2 = await Create2FactoryInstance.contractAddress()
    let testContract = await TestContract.at(addr1)

    await testContract.setNum(2);
    let num = await testContract.num();
    assert.equal(true, await Create2FactoryInstance.isContract(addr1))
    assert.equal(num, 2, "num should match");
    assert.equal(addr1, addr2, "address should match");
  });
});
