pragma solidity ^0.5.0;

import "../common/IERC725.sol";
import "../common/Storage.sol";


contract ERC725Base is IERC725, Storage
{
	uint256 constant OPERATION_CALL   = 0;
	uint256 constant OPERATION_CREATE = 1;

	// Need this to handle deposit call forwarded by the proxy
	function () external payable {}

	function getData(bytes32 _key)
	external view returns (bytes32)
	{
		return m_store[_key];
	}

	function setData(bytes32 _key, bytes32 _value)
	external protected
	{
		m_store[_key] = _value;
		emit DataChanged(_key, _value);
	}

	// Someone having this as part of WalletMaster causes an out-of-gas error in some strange cases :/
	// function execute(uint256 _operationType, address _to, uint256 _value, bytes memory _data)
	// public
	// {
	// 	require(msg.sender == this.owner(), 'access-forbidden');
	// 	if (_operationType == OPERATION_CALL)
	// 	{
	// 		bool success;
	// 		bytes memory returndata;
	// 		(success, returndata) = _to.call.value(_value)(_data);
	// 		require(success);
	// 	}
	// 	else if (_operationType == OPERATION_CREATE)
	// 	{
	// 		address newContract;
	// 		assembly
	// 		{
	// 			newContract := create(0, add(_data, 0x20), mload(_data))
	// 		}
	// 		emit ContractCreated(newContract);
	// 	}
	// 	else
	// 	{
	// 		revert('invalid-operation-type');
	// 	}
	// }
}
