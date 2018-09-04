pragma solidity ^0.4.24;

import "./KeyHolder.sol";
import "./ENS/ENS.sol";
import "./ENS/FIFSRegistrar.sol";
import "./ENS/PublicResolver.sol";


contract ENSRegistered {
    constructor(bytes32 _hashLabel, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) {
        registrar.register(_hashLabel, address(this));
        ens.setResolver(_node, resolver);
        resolver.setAddr(_node, address(this));
    }
}
