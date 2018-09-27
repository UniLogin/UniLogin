pragma solidity ^0.4.24;

import "./Token.sol";

/* solium-disable security/no-block-members*/
contract Clicker {
    uint public lastPressed;
    Token public tokenContract;

    event ButtonPress(address presser, uint pressTime, uint score);

    constructor(address _tokenContract) public {
    	tokenContract = Token(_tokenContract);
    }

    /// @notice Press the button!
    function press() public {
    	require(tokenContract.transferFrom(msg.sender, address(this), 1));
        emit ButtonPress(msg.sender, now, now - lastPressed);
        lastPressed = now;
    }
}
