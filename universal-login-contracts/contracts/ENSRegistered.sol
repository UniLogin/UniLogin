pragma solidity ^0.5.2;

import "./ENS/ENS.sol";
import "./ENS/FIFSRegistrar.sol";
import "./ENS/PublicResolver.sol";
import "./ENS/ReverseRegistrar.sol";


contract ENSRegistered {
    bytes32 constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    function ENSregister(bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) internal {
        registrar.register(_hashLabel, address(this));
        ens.setResolver(_node, address(resolver));
        resolver.setAddr(_node, address(this));
        ReverseRegistrar reverseRegistrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
        reverseRegistrar.setName(_name);
    }
}
