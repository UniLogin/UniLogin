import {utils} from 'ethers';

const  messageSignature = (wallet, to, amount, data) => 
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['address', 'uint256', 'bytes'],
      [to, amount, data])
    )); 

export {messageSignature};
