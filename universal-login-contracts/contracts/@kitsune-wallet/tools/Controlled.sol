pragma solidity ^0.5.0;

/**
 * @title ControlledUpgradeabilityProxy
 * @dev TODO
 */
contract Controlled
{
	/**
	 * @dev Modifier to check whether the `msg.sender` is the controller.
	 */
	modifier onlyController()
	{
		require(msg.sender == _controller(), "access-denied");
		_;
	}

	/**
	 * @dev Returns the current controller.
	 * @return Address of the current controller
	 */
	function _controller() internal view returns (address);
}
