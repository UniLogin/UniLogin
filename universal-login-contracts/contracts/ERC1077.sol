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
        uint gasLimit,
        address gasToken,
        OperationType operationType,
        bytes32 extraHash,
        bytes signatures) public view returns (bool)
    {
        address signer = getSigner(
            this,
            to,
            value,
            keccak256(data),
            nonce,
            gasPrice,
            gasLimit,
            gasToken,
            operationType,
            extraHash,
            signatures);
        return keyExist(bytes32(signer));
    }

    function calculateMessageHash(
        address from,
        address to,
        uint value,
        bytes32 dataHash,
        uint nonce,
        uint gasPrice,
        uint gasLimit,
        address gasToken,
        OperationType operationType,
        bytes32 _extraHash) public pure returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                from,
                to,
                value,
                dataHash,
                nonce,
                gasPrice,
                gasLimit,
                gasToken,
                uint(operationType),
                keccak256(bytes32(0x0))
        ));
    }

    function getSigner(
        address from,
        address to,
        uint value,
        bytes32 dataHash,
        uint nonce,
        uint gasPrice,
        uint gasLimit,
        address gasToken,
        OperationType operationType,
        bytes32 extraHash,
        bytes signatures ) public pure returns (address)
    {
        return calculateMessageHash(
            from,
            to,
            value,
            dataHash,
            nonce,
            gasPrice,
            gasLimit,
            gasToken,
            operationType,
            extraHash).toEthSignedMessageHash().recover(signatures);
    }

    function executeSigned(
        address to,
        uint256 value,
        bytes data,
        uint nonce,
        uint gasPrice,
        uint gasLimit,
        address gasToken,
        OperationType operationType,
        bytes32 extraHash,
        bytes signatures) public returns (bytes32)
    {
        require(nonce == _lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasLimit, gasToken, operationType, extraHash, signatures), "Invalid signature");
        /* solium-disable-next-line security/no-call-value */
        bool success = to.call.value(value)(data);
        bytes32 executionId = keccak256(nonce, signatures);
        emit ExecutedSigned(executionId, _lastNonce, success);
        _lastNonce++;
        return executionId;
    }
}
