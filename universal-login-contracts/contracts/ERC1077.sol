pragma solidity ^0.4.24;

import "./KeyHolder.sol";
import "./IERC1077.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";


contract ERC1077 is KeyHolder, IERC1077 {
    using ECRecovery for bytes32;

    event ExecutedSigned(bytes32 signHash, uint nonce, bool success);

    uint _lastNonce;

    constructor(bytes32 _key) KeyHolder(_key) public {
    }

    function lastNonce() public view returns (uint) {
        return _lastNonce;
    }

    function canExecute(
        address to,
        uint256 value,
        bytes data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes signatures) public view returns (bool)
    {
        address signer = getSigner(
            this,
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit,
            operationType,
            signatures);
        return keyExist(bytes32(signer));
    }

    function calculateMessageHash(
        address from,
        address to,
        uint256 value,
        bytes data,
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
        bytes data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes signatures ) public pure returns (address)
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
        bytes data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes signatures) public returns (bytes32)
    {
        require(nonce == _lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, signatures), "Invalid signature");
        /* solium-disable-next-line security/no-call-value */
        bool success = to.call.value(value)(data);
        bytes32 messageHash = calculateMessageHash(this, to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType);
        emit ExecutedSigned(messageHash, _lastNonce, success);
        _lastNonce++;
        return messageHash;
    }
}
