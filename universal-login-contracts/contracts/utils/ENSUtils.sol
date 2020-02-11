pragma solidity ^0.5.2;


interface ReverseRegistrar {
    function setName(string calldata name) external;
}


interface PublicResolver {
    function setAddr(bytes32 node, address contractAddress) external;
    function name(bytes32 node) external view returns(string memory);
}


interface FIFSRegistrar {
    function register(bytes32 hashLabel, address contractAddress) external;
}


interface ENS {
    function setResolver(bytes32 node, address contractAddress) external;
    function owner(bytes32 node) external returns(address);
}


contract ENSUtils {
    bytes32 constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    function registerENS(bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver) internal {
        registrar.register(_hashLabel, address(this));
        ens.setResolver(_node, address(resolver));
        resolver.setAddr(_node, address(this));
        ReverseRegistrar reverseRegistrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
        reverseRegistrar.setName(_name);
    }
}
