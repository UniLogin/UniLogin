pragma solidity ^0.5.2;

import "../wallet/Wallet.sol";


contract UpgratedWallet is Wallet {
    function getFive() public view returns(uint) {
        return 5;
    }
}
