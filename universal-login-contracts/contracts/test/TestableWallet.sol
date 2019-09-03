pragma solidity ^0.5.2;

import "../wallet/Wallet.sol";
import "./TestableKeyHolder.sol";


contract TestableWallet is Wallet {
    modifier onlyAuthorised() {
        require(keyExist(msg.sender) || msg.sender == address(this), "Sender not permissioned");
        _;
    }
}
