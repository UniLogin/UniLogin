pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract ECDSAUtils {
    using ECDSA for bytes32;

    function recoverSigner(bytes32 dataHash, bytes memory signatures, uint256 index) public pure returns(address) {
        require(signatures.length % 65 == 0, "Invalid signature");
        require(index < signatures.length / 65, "Signature out of bound");
        uint8 v;
        bytes32 r;
        bytes32 s;
        /* solium-disable-next-line security/no-inline-assembly*/
        assembly {
            let signaturePos := mul(0x41, index)
            r := mload(add(signatures, add(signaturePos, 0x20)))
            s := mload(add(signatures, add(signaturePos, 0x40)))
            v := and(mload(add(signatures, add(signaturePos, 0x41))), 0xff)
        }
        return ecrecover(dataHash.toEthSignedMessageHash(), v, r, s);
    }

    function calculateMessageHash(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimitExecution,
        uint gasData) public pure returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                from,
                to,
                value,
                keccak256(data),
                nonce,
                gasPrice,
                gasToken,
                gasLimitExecution,
                gasData
        ));
    }
}