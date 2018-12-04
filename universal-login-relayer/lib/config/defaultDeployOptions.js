import {utils} from 'ethers';

const defaultDeployOptions = {
  gasLimit: utils.bigNumberify(3500000),
  gasPrice: utils.bigNumberify(9000000000)
};
  
export default defaultDeployOptions;
