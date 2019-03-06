pragma solidity ^0.5.2;

import "./ENSRegistered.sol";
import "./ERC1077.sol";


contract Identity is ENSRegistered, ERC1077 {
    constructor(
        address _key, bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver)
        payable public
        ENSRegistered(_hashLabel, _name, _node, ens, registrar, resolver)
        ERC1077(_key) {
    }
}
