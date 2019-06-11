pragma solidity ^0.5.2;

contract Factory {
    address public contractAddress;

    function createContract(address signer, bytes32 salt, bytes memory initCode) public returns(address newContract) {
        bytes32 finalSalt = keccak256(abi.encodePacked(salt, signer));
        // address newContract = 0; 
        assembly {
            newContract := create2(0, add(initCode, 0x20), mload(initCode), finalSalt)
            if iszero(extcodesize(newContract)) {revert(0, 0)}
        }
        contractAddress = newContract;
        return newContract;
    }

    function getContractAddress() public view returns(address) {
        return contractAddress;
    }

    function computeContractAddress(address signer, bytes32 salt, bytes memory initCode) public view returns(address futureContractAddress) {
        bytes32 finalSalt = keccak256(abi.encodePacked(salt, signer));
        bytes32 hashedData = keccak256(abi.encodePacked(bytes1(0xff), address(this), finalSalt, keccak256(initCode)));
        futureContractAddress = convertDataToAddress(hashedData);
        return futureContractAddress;
    }

    function convertDataToAddress(bytes32 data) internal view returns(address) {
        return address(bytes20(data << 96));
    }
}
