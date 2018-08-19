pragma solidity ^0.4.24;

import "./KeyHolder.sol";


contract Identity is KeyHolder {
    constructor(bytes32 _key, uint256 _neededApprovals) public KeyHolder(_key,_neededApprovals) {
    }
}
