const TestContract = artifacts.require("TestContract");
const Create2Factory = artifacts.require("Create2Factory");
salt = web3.utils.sha3('0x01')
contract('Create2', (accounts) => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const contractCode = TestContract.bytecode;
    const Create2FactoryInstance = await Create2Factory.deployed();
    let tx = await Create2FactoryInstance.setContractCode(contractCode, {from:accounts[0]})
    
    let addr1 = await Create2FactoryInstance.computeContractAddress.call(salt, accounts[0])
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
    assert.equal(false, await Create2FactoryInstance.isContract.call(addr1))

    await Create2FactoryInstance.deployContract(accounts[0],salt, signature, {from:accounts[0]})
    let addr2 = await Create2FactoryInstance.contractAddress()
    let testContract = await TestContract.at(addr1)
    
    await testContract.setNum(2);
    let num = await testContract.num();
    assert.equal(true, await Create2FactoryInstance.isContract.call(addr1))
    assert.equal(num, 2, "num should match");
    assert.equal(addr1, addr2, "address should match");
  });
});
