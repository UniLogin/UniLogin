pragma solidity ^0.4.24;


contract MockContract {
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

    function revertingFunction() public view {
        require(msg.sender == address(this));
    }
}