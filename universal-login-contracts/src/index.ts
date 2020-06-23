export {encodeInitializeWithENSData, encodeInitializeData, encodeDataForExecuteSigned} from './beta2/encode';
export {deployFactory} from './beta2/deployFactory';
export {deployWalletContract} from './beta2/deployMaster';
export {calculateBaseGas} from './estimateGas';
export {messageToUnsignedMessage, messageToSignedMessage, unsignedMessageToSignedMessage} from './message';
export * from './interfaces';
export {ContractService} from './integration/ContractService';
export {deployGnosisSafe, deployProxyFactory, deployDefaultCallbackHandler} from './gnosis-safe@1.1.1/deployContracts';
export {encodeDataForSetup, encodeDataForExecTransaction} from './gnosis-safe@1.1.1/encode';
export {computeGnosisCounterfactualAddress, calculateMessageHash, signStringMessage, calculateGnosisStringHash, calculateMessageSignature, getPreviousOwner, isInvalidOwnerError} from './gnosis-safe@1.1.1/utils';
export {SENTINEL_OWNERS, DEPLOY_CONTRACT_NONCE, INITIAL_REQUIRED_CONFIRMATIONS} from './gnosis-safe@1.1.1/constants';
export {GnosisSafeInterface, ProxyFactoryInterface, ProxyInterface, IProxyInterface, ISignatureValidatorInterface} from './gnosis-safe@1.1.1/interfaces';

import * as beta2 from './beta2/contracts';
export {beta2};

import * as ens from './ens';
export {ens};

import * as gnosisSafe from './gnosis-safe@1.1.1/contracts';
export {gnosisSafe};

import {MAGICVALUE, INVALIDSIGNATURE} from './ERC1271/constants';
const ERC1271 = {MAGICVALUE, INVALIDSIGNATURE};
export {ERC1271};
