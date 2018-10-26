pragma solidity ^0.4.24;


/* solium-disable security/no-block-members*/
contract Clicker {
    uint public lastPressed;
    event ButtonPress(address presser, uint pressTime, uint score);

    // Set up last pressed at deploy
    constructor() {
      lastPressed = now;
    }

    /// @notice Press the button!
    function press() public {
        emit ButtonPress(msg.sender, now, now - lastPressed);
        lastPressed = now;
    }
}
