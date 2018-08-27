pragma solidity ^0.4.24;


contract Clicker {
    uint256 initialClicks = 10;
    address identity;

    mapping (address => Click) public clicks;

    struct Click {
        uint256 clicksLeft;
        bool initiated;
    }

    constructor() public {

    }

    function getClicks(address _identity) public view returns(uint256) {
        return clicks[_identity].clicksLeft;
    }

    function click() public returns(bool success) {
        require(clicks[msg.sender].clicksLeft != 0, "Not enought clicks left");
        require(clicks[msg.sender].initiated == true, "Only initiated users");

        clicks[msg.sender].clicksLeft--;
        return true;
    }

    function initiate() public returns(bool success) {
        require(clicks[msg.sender].initiated == false, "Only one initiation");

        clicks[msg.sender].clicksLeft = initialClicks;
        clicks[msg.sender].initiated = true;
        return true;
    }
}