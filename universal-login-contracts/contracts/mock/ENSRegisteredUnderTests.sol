pragma solidity ^0.5.2;

import "../ENSRegistered.sol";


contract ENSRegisteredUnderTests is ENSRegistered {
    
    function registerENSUnderTests(bytes32 _hashLabel, string memory _name, bytes32 _node, bytes32 _hashDomain, ENS ens) public {
        super.registerENS(_hashLabel, _name, _node, _hashDomain, ens);
    }
}
