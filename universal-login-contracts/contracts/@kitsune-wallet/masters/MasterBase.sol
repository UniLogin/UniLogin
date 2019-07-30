pragma solidity ^0.5.0;

import "../proxy/BaseKitsuneProxy.sol";

import "./IMaster.sol";
import "../tools/Controlled.sol";

/**
 * @title MasterBase
 * @dev This contract the base kitsune's masters.
 */
contract MasterBase is IMaster, BaseKitsuneProxy, Controlled
{
	function () payable external {}

	// IERC897
	function implementation()
	external view returns (address)
	{
		return _implementation();
	}

	// IERC897
	function proxyType()
	external pure returns (uint256)
	{
		return 2;
	}

	// Controlled → IMaster
	function controller()
	external view returns (address)
	{
		return _controller();
	}

	// IMaster
	function updateImplementation(address logic, bytes calldata data, bool reset)
	external onlyController()
	{
		if (reset) { cleanup(); }
		_upgradeToAndInitialize(logic, data);
	}

	// Master virtual
	function cleanup()
	internal
	{
		revert("not-implemented");
	}

}
