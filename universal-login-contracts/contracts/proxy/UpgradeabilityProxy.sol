pragma solidity ^0.5.0;

import "../openzeppelin/BaseUpgradeabilityProxy.sol";


/**
 * @title UpgradeabilityProxy
 * @dev Extends BaseUpgradeabilityProxy with a constructor for initializing
 * implementation and init data.
 */
contract UpgradeabilityProxy is BaseUpgradeabilityProxy {
    /**
    * @dev Contract constructor.
    * @param _logic Address of the initial implementation.
    * It should include the signature and the parameters of the function to be called, as described in
    * https://solidity.readthedocs.io/en/v0.4.24/abi-spec.html#function-selector-and-argument-encoding.
    * This parameter is optional, if no data is given the initialization call to proxied contract will be skipped.
    */
    constructor(address _logic) public payable {
        assert(IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
        _setImplementation(_logic);
    }
}