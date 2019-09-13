pragma solidity ^0.5.2;

import "../wallet/Wallet.sol";


contract UpgradedWallet is Wallet {
    uint public someNumber = 7;

    function getFive() public pure returns(uint) {
        return 5;
    }

    function change(uint newNumber) public {
        someNumber = newNumber;
    }
}
