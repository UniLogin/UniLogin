pragma solidity ^0.4.24;

import "./KeyHolder.sol";
import "./ENSRegistered.sol";


contract Identity is KeyHolder, ENSRegistered {
    constructor(bytes32 _key, bytes32 _hashLabel, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) payable public
        ENSRegistered(_hashLabel, _node, ens, registrar, resolver)
        KeyHolder(_key) {
    }
}
