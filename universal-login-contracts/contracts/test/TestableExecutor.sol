pragma solidity ^0.5.2;

import "../wallet/Executor.sol";
import "../wallet/KeyHolder.sol";


/* solium-disable no-empty-blocks */
contract TestableExecutor is Executor, KeyHolder {

    constructor(address _key) KeyHolder(_key) public {}

    function setRequiredSignatures(uint _requiredSignatures) public onlyAuthorised {
        require(_requiredSignatures != requiredSignatures && _requiredSignatures > 0, "Invalid required signature");
        require(_requiredSignatures <= keyCount, "Signatures exceed owned keys number");
        requiredSignatures = _requiredSignatures;
    }

    function getSigner(
        address from,
        address to,
        uint value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        bytes memory signatures) public pure returns (address)
    {
        return calculateMessageHash(
            from,
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit).toEthSignedMessageHash().recover(signatures);
    }

    function areSignaturesValid(bytes memory signatures, bytes32 dataHash) private view returns(bool) {
        // There cannot be an owner with address 0.
        uint sigCount = signatures.length / 65;
        address lastSigner = address(0);
        address signer;
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 i;
        for (i = 0; i < sigCount; i++) {
            /* solium-disable-next-line security/no-inline-assembly*/
            assembly {
                let signaturePos := mul(0x41, i)
                r := mload(add(signatures, add(signaturePos, 0x20)))
                s := mload(add(signatures, add(signaturePos, 0x40)))
                v := and(mload(add(signatures, add(signaturePos, 0x41))), 0xff)
            }
            signer = ecrecover(dataHash, v, r, s);
            if (!keyExist(signer) || signer <= lastSigner) {
                return false;
            }

            lastSigner = signer;
        }
        return true;
    }

}
