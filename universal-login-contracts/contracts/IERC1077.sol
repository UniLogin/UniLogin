pragma solidity ^0.4.24;


contract IERC1077 {
    enum OperationType {CALL, DELEGATECALL, CREATE}

    event ExecutedSigned(bytes32 executionId, address from, uint nonce, bool success);

    function lastNonce() public view returns (uint nonce);

    function canExecute(
        address to,
        uint256 value,
        bytes data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes signatures) public view returns (bool);

    function executeSigned(
        address to,
        uint256 value,
        bytes data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes signatures) public returns (bytes32);
}
