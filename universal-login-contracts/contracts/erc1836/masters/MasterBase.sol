pragma solidity ^0.5.0;

import "../common/IMaster.sol";
import "./ERC725Base.sol";


contract MasterBase is IMaster, ERC725Base
{
	function master()
	external view returns (address)
	{
		return m_master;
	}

	function masterId()
	external pure returns (bytes32)
	{
		return MASTER_ID;
	}
}
