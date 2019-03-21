pragma solidity ^0.5.2;

import "./common/MasterCopy.sol";
import "./WalletContract.sol";


contract IdentityMasterCopy is MasterCopy, WalletContract {
    constructor(address _key, bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver)
        WalletContract(_key, _hashLabel, _name, _node, ens, registrar, resolver) public {
    }
}
