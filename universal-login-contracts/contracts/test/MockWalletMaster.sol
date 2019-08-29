pragma solidity ^0.5.2;

import "../wallet/Wallet.sol";


contract MockWalletMaster is Wallet {
    uint256 _count;

    function giveAway() external payable {
    }

    function count() public view returns(uint256) {
        return _count;
    }

    function increase() public {
        _count++;
    }
}
