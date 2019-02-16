contract Create2Factory {
    bytes public contractCode;
    address public contractAddress;
    
    function setContractCode(bytes memory _contractCode) public {
        contractCode = _contractCode;
    }
    
    function create2Contract() public returns (address _contract) {
        bytes memory _contractCode = contractCode;
        bytes32 salt = bytes32(0);
        
        assembly {
            _contract := create2(0, add(_contractCode, 0x20), mload(_contractCode), salt)
            if iszero(extcodesize(_contract)) {revert(0, 0)}
        }
        contractAddress = _contract;
    }
}