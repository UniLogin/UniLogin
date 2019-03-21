pragma solidity ^0.5.2;

import "./ENSRegistered.sol";
import "./ERC1077Proxy.sol";


contract IdentityProxy is ENSRegistered, ERC1077Proxy {
    constructor(
        address _masterCopy,
        address _key,
        bytes32 _hashLabel,
        string memory _name,
        bytes32 _node,
        ENS _ens,
        FIFSRegistrar _registrar,
        PublicResolver _resolver)
    ENSRegistered(_hashLabel, _name, _node, _ens, _registrar, _resolver)
    ERC1077Proxy(_masterCopy, _key) public {
    }
}