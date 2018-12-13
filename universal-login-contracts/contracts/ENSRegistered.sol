pragma solidity ^0.4.24;

import "./ENS/ENS.sol";
import "./ENS/FIFSRegistrar.sol";
import "./ENS/PublicResolver.sol";
import "./ENS/ReverseRegistrar.sol";


contract ENSRegistered {
    bytes32 constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;
    
    constructor(bytes32 _hashLabel, string _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) {
        registrar.register(_hashLabel, address(this));
        ens.setResolver(_node, resolver);
        resolver.setAddr(_node, address(this));
        ReverseRegistrar reverseRegistrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
        reverseRegistrar.claim(address(this));
        bytes32 reverseNode = keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(address(this))));
        resolver.setName(reverseNode, _name);
    }

    function sha3HexAddress(address addr) private returns (bytes32 ret) {
        addr;
        ret; // Stop warning us about unused variables
        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000
            let i := 40
        loop:
            i := sub(i, 1)
            mstore8(i, byte(and(addr, 0xf), lookup))
            addr := div(addr, 0x10)
            i := sub(i, 1)
            mstore8(i, byte(and(addr, 0xf), lookup))
            addr := div(addr, 0x10)
            jumpi(loop, i)
            ret := keccak256(0, 40)
        }
    }
}
