pragma solidity ^0.4.24;

import "./ENSRegisteredLegacy.sol";
import "./ERC1077.sol";


contract IdentityLegacy is ENSRegisteredLegacy, ERC1077 {
    constructor(
        bytes32 _key, bytes32 _hashLabel, string _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) 
        payable public
        ENSRegisteredLegacy(_hashLabel, _name, _node, ens, registrar, resolver)
        ERC1077(_key) {
    }
}
