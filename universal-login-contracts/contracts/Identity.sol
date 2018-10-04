pragma solidity ^0.4.24;

import "./ENSRegistered.sol";
import "./SignedApprovalScheme.sol";


contract Identity is ENSRegistered, SignedApprovalScheme {
    constructor(
        bytes32 _key, bytes32 _hashLabel, string _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) 
        payable public
        ENSRegistered(_hashLabel, _name, _node, ens, registrar, resolver)
        SignedApprovalScheme(_key) {
    }
}
