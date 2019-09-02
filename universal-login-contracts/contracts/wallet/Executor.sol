pragma solidity ^0.5.2;

import "./KeyHolder.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract Executor is KeyHolder {
    using ECDSA for bytes32;

    uint public lastNonce;
    uint public requiredSignatures;

    event ExecutedSigned(bytes32 indexed messageHash, uint indexed nonce, bool indexed success);

    constructor(address _key) KeyHolder(_key) public {
        requiredSignatures = 1;
    }

    function etherRefundCharge() public pure returns(uint) {
        return 14000;
    }

    function tokenRefundCharge() public pure returns(uint) {
        return 19500;
    }

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

    function setRequiredSignatures(uint _requiredSignatures) public onlyAuthorised {
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
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        bytes memory signatures) public returns (bytes32)
    {
        require(signatures.length != 0, "Invalid signatures");
        require(signatures.length >= requiredSignatures * 65, "Not enough signatures");
        require(nonce == lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasToken, gasLimit, signatures), "Invalid signature");
        lastNonce++;
        uint256 startingGas = gasleft();
        bytes memory _data;
        bool success;
        /* solium-disable-next-line security/no-call-value */
        (success, _data) = to.call.gas(gasleft().sub(refundGas(gasToken))).value(value)(data);
        bytes32 messageHash = calculateMessageHash(address(this), to, value, data, nonce, gasPrice, gasToken, gasLimit);
        emit ExecutedSigned(messageHash, nonce, success);
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

    function areSignaturesValid(bytes memory signatures, bytes32 dataHash) private view returns(bool) {}
}
