.. _signer:

Signer
======

This is an experimental feature. Do not use in production and expect changes!

::
  // gasToken should be configured when creating SDK instance in order to use the signer
  const signer = new SdkSigner(sdk, contractAddress, privateKey);

  const token = new Contract(contractAddress, contractInterface, signer)
  await contract.transfer(someOtherAddress, utils.parseEther('123'))
