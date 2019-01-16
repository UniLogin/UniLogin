pragma solidity ^0.5.2;


contract IERC1077 {
    enum OperationType {CALL, DELEGATECALL, CREATE}

    event ExecutedSigned(bytes32 indexed messageHash, uint indexed nonce, bool indexed success);

    function lastNonce() public view returns (uint nonce);

    function canExecute(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public view returns (bool);

    function executeSigned(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public returns (bytes32);
}
