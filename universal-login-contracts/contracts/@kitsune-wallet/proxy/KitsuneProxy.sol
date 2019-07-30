pragma solidity ^0.5.0;

import "./BaseKitsuneProxy.sol";

contract KitsuneProxy is BaseKitsuneProxy
{
	constructor(address _logic, bytes memory _data)
	public payable
	{
		_upgradeToAndInitialize(_logic, _data);
	}
}
