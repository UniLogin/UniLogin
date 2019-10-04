pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "./WalletProxy.sol";
import "../utils/ECDSAUtils.sol";


contract WalletProxyFactory is Ownable, ECDSAUtils {
    bytes public initCode;
    using ECDSA for bytes32;

    constructor(address walletContractAddress) public {
        initCode = abi.encodePacked(type(WalletProxy).creationCode, uint256(walletContractAddress));
    }

    function createContract(address publicKey, bytes memory initializeWithENS, bytes memory signature) public onlyOwner returns(bool success) {
        require(publicKey == getSigner(initializeWithENS, signature), "Invalid signature");
        bytes32 finalSalt = keccak256(abi.encodePacked(publicKey));
        bytes memory _initCode = initCode;
        address contractAddress;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            contractAddress := create2(0, add(_initCode, 0x20), mload(_initCode), finalSalt)
            if iszero(extcodesize(contractAddress)) {revert(0, 0)}
        }
        // solium-disable-next-line security/no-low-level-calls
        (success, ) = contractAddress.call(initializeWithENS);
        require(success, "Unable to register ENS domain");
        return success;
    }

    function getSigner(bytes memory initializeWithENS, bytes memory signature) public pure returns (address) {
        return ECDSAUtils.recoverSigner(keccak256(abi.encodePacked(initializeWithENS)), signature, 0);
    }
}
