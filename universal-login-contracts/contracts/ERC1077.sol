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
        bytes extraData,
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
            extraData,
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
        OperationType operationType,
        bytes extraData) public pure returns (bytes32)
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
                uint(operationType),
                keccak256(extraData)
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
        bytes extraData,
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
            operationType,
            extraData).toEthSignedMessageHash().recover(signatures);
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
        bytes extraData,
        bytes signatures) public returns (bytes32)
    {
        require(nonce == _lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, extraData, signatures), "Invalid signature");
        /* solium-disable-next-line security/no-call-value */
        bool success = to.call.value(value)(data);
        bytes32 executionId = keccak256(abi.encodePacked(nonce, signatures));
        emit ExecutedSigned(executionId, _lastNonce, success);
        _lastNonce++;
        return executionId;
    }
}
