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
        return 16000;
    }

    function tokenRefundCharge() public pure returns(uint) {
        return 21000;
    }

    function gasLimitMargin() public pure returns(uint) {
        return 9000;
    }

    function transactionGasCost(uint gasData) public pure returns(uint) {
        return gasData.add(21000); // 21000 - cost for initiating transaction
    }

    function computeGasUsedWithFee(uint gasUsed) public pure returns(uint) {
        return gasUsed.div(5).mul(6); // 20% fee
    }

    function keyExist(address _key) public view returns(bool);


    function executeSigned(
        address to,
        uint256 value,
        bytes memory data,
        uint gasPrice,
        address gasToken,
        uint gasLimitExecution,
        uint gasData,
        bytes memory signatures) public returns (bytes32)
    {
        uint256 startingGas = gasleft();
        require(gasLimitExecution <= startingGas, "Relayer set gas limit too low");
        require(startingGas <= gasLimitExecution.add(gasLimitMargin()), "Relayer set gas limit too high");
        require(signatures.length != 0, "Invalid signatures");
        require(signatures.length >= requiredSignatures * 65, "Not enough signatures");
        bytes32 messageHash = calculateMessageHash(address(this), to, value, data, lastNonce, gasPrice, gasToken, gasLimitExecution, gasData);
        require(verifySignatures(signatures, messageHash.toEthSignedMessageHash()), "Invalid signature or nonce");
        lastNonce++;
        bytes memory _data;
        bool success;
        /* solium-disable-next-line security/no-call-value */
        (success, _data) = to.call.gas(gasleft().sub(refundGas(gasToken))).value(value)(data);
        emit ExecutedSigned(messageHash, lastNonce.sub(1), success);
        uint256 gasUsed = startingGas.sub(gasleft()).add(transactionGasCost(gasData)).add(refundGas(gasToken));
        refund(gasUsed, gasPrice, gasToken, msg.sender);
        return messageHash;
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

    function refund(uint256 gasUsed, uint gasPrice, address gasToken, address payable beneficiary) internal {
        if (gasToken != address(0)) {
            ERC20 token = ERC20(gasToken);
            token.transfer(beneficiary, computeGasUsedWithFee(gasUsed).mul(gasPrice));
        } else {
            beneficiary.transfer(computeGasUsedWithFee(gasUsed).mul(gasPrice));
        }
    }

    function refundGas(address gasToken) private pure returns(uint refundCharge) {
        if (gasToken == address(0)) {
            return etherRefundCharge();
        } else {
            return tokenRefundCharge();
        }
    }

    function verifySignatures(bytes memory signatures, bytes32 dataHash) private view returns(bool) {
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
