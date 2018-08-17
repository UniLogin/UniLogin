pragma solidity ^0.4.24;

contract MochaContract {
    bool public wasCalled;

    constructor() public {
        wasCalled = false;
    }

    function() public {
        wasCalled = true;
    }

    function callMe() public {
        wasCalled = true;
    }

    function getWasCalledValue() public view returns(bool) {
        return wasCalled;
    }
}