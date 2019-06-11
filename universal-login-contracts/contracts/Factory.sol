pragma solidity ^0.5.2;

contract Factory {
    function computeContractAddress(address signer, bytes32 salt, bytes memory initCode) public view returns(address) {
        bytes32 finalSalt = keccak256(abi.encodePacked(signer, salt));
        bytes32 initCodeHash = keccak256(abi.encodePacked(initCode));
        bytes32 hashedData = keccak256(abi.encodePacked(bytes1(0xff), address(this), finalSalt, initCodeHash));
        address futureContractAddress = address(bytes20(hashedData));
        return futureContractAddress;
    }
}
