pragma solidity ^0.5.2;

import "../ENSRegistered.sol";


contract ENSRegisteredUnderTests is ENSRegistered {
    
    function registerENSUnderTests(bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) public {
        super.registerENS(_hashLabel, _name, _node, ens, registrar, resolver);
    }
}
