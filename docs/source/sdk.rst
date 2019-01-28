UniversalLoginSDK
=================

UniversalLoginSDK is a JS library, that helps communicate with relayer.

Creating an instance:
::
  import UniversalLoginSDK from 'universal-login-sdk';

  const universalLoginSDK = new UniversalLoginSDK('http://myrelayer.ethworks.io', 'https://ropsten.infura.io', { gasLimit: 100000 });


The last parameter is message options and it is optional. If no message options provided, sdk use default message options:
::
  {
    gasPrice: 1000000000,
    gasLimit: 1000000,
    operationType: OPERATION_CALL
  }