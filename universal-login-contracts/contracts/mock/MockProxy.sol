pragma solidity ^0.5.0;

import "../common/Proxy.sol";


contract MockProxy is Proxy {
    uint256 _count;

    constructor(address _master, bytes memory _initData) Proxy(_master, _initData) public {
        _count = 10;
    }

    function count() public view returns(uint256) {
        return _count;
    }
}
