pragma solidity ^0.5.0;

import "../common/MasterBase.sol";


contract MockMasterBase is MasterBase {
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
