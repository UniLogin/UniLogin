pragma solidity ^0.4.24;


/* solium-disable security/no-block-members*/
contract Clicker {
    uint public lastPressed;
    event ButtonPress(address presser, uint pressTime, uint diff);

    /// @notice Press the button!
    function press() public {
        emit ButtonPress(msg.sender, now, now - lastPressed);
        lastPressed = now;
    }
}
