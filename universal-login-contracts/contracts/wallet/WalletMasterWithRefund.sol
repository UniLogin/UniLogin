// pragma solidity ^0.5.2;

// import "./WalletMaster.sol";


// /* solium-disable no-empty-blocks */
// contract WalletMasterWithRefund is WalletMaster {
//     // Disabled upgradability: persistent nonce not sync
//     function initializeWithRefund(
//         address _key,
//         bytes32 _hashLabel,
//         string calldata _name,
//         bytes32 _node,
//         ENS ens,
//         FIFSRegistrar registrar,
//         PublicResolver resolver,
//         uint gasPrice) external onlyInitializing()
//     {
//         this.initializeWithENS(_key, _hashLabel, _name, _node, ens, registrar, resolver);
//         /* solium-disable security/no-tx-origin*/
//         refund(getDeploymentGasUsed(), gasPrice, address(0), tx.origin);
//     }

//     function getDeploymentGasUsed() private pure returns(uint) {
//         return 500000;
//     }
// }
