pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ProxyCounterfactualFactory is Ownable {
    address public contractAddress;

    function createContract(address signer, address publicKey, bytes memory initCode, bytes memory initializeWithENS) public onlyOwner returns(bool success) {
        bytes32 finalSalt = keccak256(abi.encodePacked(publicKey, signer));
        address newContractAddress;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            newContractAddress := create2(0, add(initCode, 0x20), mload(initCode), finalSalt)
            if iszero(extcodesize(newContractAddress)) {revert(0, 0)}
        }
        bytes memory _data;
        (success, _data) = newContractAddress.call(initializeWithENS);
        contractAddress = newContractAddress;
        return success;
    }

    function computeContractAddress(address signer, address publicKey, bytes memory initCode) public view returns(address futureContractAddress) {
        bytes32 finalSalt = keccak256(abi.encodePacked(publicKey, signer));
        bytes32 hashedData = keccak256(abi.encodePacked(bytes1(0xff), address(this), finalSalt, keccak256(initCode)));
        futureContractAddress = convertDataToAddress(hashedData);
        return futureContractAddress;
    }

    function convertDataToAddress(bytes32 data) internal view returns(address) {
        return address(bytes20(data << 96));
    }
}
