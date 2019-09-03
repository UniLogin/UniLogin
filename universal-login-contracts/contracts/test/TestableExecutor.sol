pragma solidity ^0.5.2;

import "../wallet/Executor.sol";


contract TestableExecutor is Executor {
    mapping (address => bool) public keys;

    constructor(address _key) public {
        keys[_key] = true;
    }

    function() external payable {

    }

    function addKey(address _key) public returns(bool success) {
        keys[_key] = true;
        return true;
    }

    function keyExist(address _key) public view returns(bool) {
        return keys[_key];
    }

    function setRequiredSignatures(uint _requiredSignatures) public returns(bool success) {
        requiredSignatures = _requiredSignatures;
        return true;
    }
}
