import {utils} from 'ethers';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

export default addressToBytes32;
