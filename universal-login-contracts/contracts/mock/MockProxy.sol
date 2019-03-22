pragma solidity ^0.5.0;

import "../common/Proxy.sol";


contract MockProxy is Proxy {
    uint256 _count;

    constructor(address _masterCopy) Proxy(_masterCopy) public {
        _count = 10;
    }

    function count() public view returns(uint256) {
        return _count;
    }
}