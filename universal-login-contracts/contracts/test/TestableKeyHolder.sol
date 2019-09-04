pragma solidity ^0.5.2;

import "../wallet/KeyHolder.sol";


contract TestableKeyHolder is KeyHolder {
    constructor(address _key) KeyHolder(_key) public {

    }

    modifier onlyAuthorised() {
        require(keyExist(msg.sender) || msg.sender == address(this), "Sender not permissioned");
        _;
    }
}
