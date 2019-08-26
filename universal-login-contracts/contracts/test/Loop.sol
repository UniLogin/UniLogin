pragma solidity ^0.5.2;


contract Loop {
    uint counter = 0;
    function loop() public {
        while (true) {
            counter++;
        }
    }
}