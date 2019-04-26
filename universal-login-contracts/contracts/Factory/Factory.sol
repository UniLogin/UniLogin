pragma solidity >0.4.99 <0.6.0;


contract Factory {

    function deploy(bytes memory code, uint256 salt) public returns(address) {
        address addr;
        /* solium-disable-next-line security/no-inline-assembly*/
        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
                if iszero(extcodesize(addr)) {
                    revert(0, 0) 
                }
        } 
        return addr;
    }
}