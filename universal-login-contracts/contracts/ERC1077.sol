pragma solidity ^0.5.2;

import "./KeyHolder/KeyHolder.sol";
import "./IERC1077.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";


contract ERC1077 is KeyHolder, IERC1077, IERC721Receiver {
    using ECDSA for bytes32;
    using SafeMath for uint;

    uint public lastNonce;
    uint public requiredSignatures;

    constructor(address _key) KeyHolder(_key) public {
        requiredSignatures = 1;
    }

    function canExecute(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public view returns (bool)
    {
        bytes32 hash = calculateMessageHash(
            address(this),
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit,
            operationType).toEthSignedMessageHash();
        return areSignaturesValid(signatures, hash);
    }

    function setRequiredSignatures(uint _requiredSignatures) public onlyManagementKeyOrThisContract {
        require(_requiredSignatures != requiredSignatures && _requiredSignatures > 0, "Invalid required signature");
        require(_requiredSignatures <= keyCount, "Signatures exceed owned keys number"); 
        requiredSignatures = _requiredSignatures;
    }

    function calculateMessageHash(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType) public pure returns (bytes32)
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
                gasLimit,
                uint(operationType)
        ));
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
        OperationType operationType,
        bytes memory signatures ) public pure returns (address)
    {
        return calculateMessageHash(
            from,
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit,
            operationType).toEthSignedMessageHash().recover(signatures);
    }

    function executeSigned(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public returns (bytes32)
    {
        require(signatures.length != 0, "Invalid signatures");
        require(signatures.length >= requiredSignatures * 65, "Not enough signatures");
        require(nonce == lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, signatures), "Invalid signature");
        uint256 startingGas = gasleft();
        bytes memory _data;
        bool success;
        /* solium-disable-next-line security/no-call-value */
        (success, _data) = to.call.value(value)(data);
        bytes32 messageHash = calculateMessageHash(address(this), to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType);
        emit ExecutedSigned(messageHash, lastNonce, success);
        lastNonce++;
        uint256 gasUsed = startingGas.sub(gasleft());
        refund(gasUsed, gasPrice, gasToken);
        return messageHash;
    }

    function onERC721Received(address, address, uint256, bytes memory) public returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function refund(uint256 gasUsed, uint gasPrice, address gasToken) private {
        if (gasToken != address(0)) {
            ERC20 token = ERC20(gasToken);
            token.transfer(msg.sender, gasUsed.mul(gasPrice));
        } else {
            msg.sender.transfer(gasUsed.mul(gasPrice));
        }
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
