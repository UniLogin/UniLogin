pragma solidity ^0.4.24;

import "./KeyHolder.sol";


contract Identity is KeyHolder {
    constructor(bytes32 _key) public KeyHolder(_key) {
    }
}
