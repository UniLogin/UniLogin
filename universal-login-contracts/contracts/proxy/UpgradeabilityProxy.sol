pragma solidity ^0.5.0;

import "../openzeppelin/BaseUpgradeabilityProxy.sol";


contract UpgradeabilityProxy is BaseUpgradeabilityProxy {
    constructor(address _logic) public payable {
        assert(IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
        _setImplementation(_logic);
    }
}