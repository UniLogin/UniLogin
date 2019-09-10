pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Executor {
    using ECDSA for bytes32;
    using SafeMath for uint;

    uint public lastNonce;
    uint public requiredSignatures;

    event ExecutedSigned(bytes32 indexed messageHash, uint indexed nonce, bool indexed success);

    constructor() public {
        requiredSignatures = 1;
    }

    function etherRefundCharge() public pure returns(uint) {
        return 14300;
    }

    function tokenRefundCharge() public pure returns(uint) {
        return 19800;
    }

    function keyExist(address _key) public view returns(bool);

    function canExecute(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
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
            gasLimit).toEthSignedMessageHash();
        return areSignaturesValid(signatures, hash);
    }

    function calculateMessageHash(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit) public pure returns (bytes32)
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
                gasLimit
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

    function executeSigned(
        address to,
        uint256 value,
        bytes memory data,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        uint gasData,
        bytes memory signatures) public returns (bytes32)
    {
        require(signatures.length != 0, "Invalid signatures");
        require(signatures.length >= requiredSignatures * 65, "Not enough signatures");
        require(canExecute(to, value, data, lastNonce, gasPrice, gasToken, gasLimit, signatures), "Invalid signature or nonce");
        lastNonce++;
        uint256 startingGas = gasleft();
        bytes memory _data;
        bool success;
        /* solium-disable-next-line security/no-call-value */
        (success, _data) = to.call.gas(gasleft().sub(refundGas(gasToken))).value(value)(data);
        bytes32 messageHash = calculateMessageHash(address(this), to, value, data, lastNonce.sub(1), gasPrice, gasToken, gasLimit);
        emit ExecutedSigned(messageHash, lastNonce.sub(1), success);
        uint256 gasUsed = startingGas.sub(gasleft());
        refund(gasUsed, gasPrice, gasToken, msg.sender);
        return messageHash;
    }

    function refund(uint256 gasUsed, uint gasPrice, address gasToken, address payable beneficiary) internal {
        if (gasToken != address(0)) {
            ERC20 token = ERC20(gasToken);
            token.transfer(beneficiary, gasUsed.mul(gasPrice));
        } else {
            beneficiary.transfer(gasUsed.mul(gasPrice));
        }
    }

    function refundGas(address gasToken) private pure returns(uint refundCharge) {
        if (gasToken == address(0)) {
            return etherRefundCharge();
        } else {
            return tokenRefundCharge();
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
