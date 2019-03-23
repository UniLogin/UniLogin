pragma solidity ^0.5.0;

import "./IMaster.sol";

contract MasterStorage
{
	address                     internal m_master;      // Address of the master.
	uint256                     internal m_nonce;       // Reserved for nonce. Delegate using a local nonce should synchronize during init / cleanup, and erase their local nonce.
	mapping(bytes32 => bool   ) internal m_replay;      // Reserved for replay protection. Registeres the hash of executed meta-tx that shouldn't be replayed. Persistant across updates.
	mapping(bytes32 => bytes32) internal m_store;       // Generic purpose persistent store (ERC725).
	bool                        internal m_initialized; // Reserved for initialization protection.

	event DelegateChange(address indexed previousDelegate, address indexed newDelegate);

	modifier protected()
	{
		require(msg.sender == address(this), "restricted-access");
		_;
	}

	modifier initialization()
	{
		require(!m_initialized, "already-initialized");
		m_initialized = true;
		_;
	}

	function setMaster(address _newMaster, bytes memory _initData)
	internal
	{
		// keccak256("ERC1836")
		require(IMaster(_newMaster).UUID() == 0x26b8c8548d7daec1fffc293834f2cee70c6b9ca8d5c456721fc1fdf9b10dd909);

		// Update delegate pointer
		emit DelegateChange(m_master, _newMaster);
		m_master = _newMaster;

		// Allows the run of an initialization method in the new delegate.
		// Will be reset to true by the initialization modifier of the initialize methode.
		m_initialized = false;

		// Call the initialize method in the new delegate
		(bool success, /*bytes memory returndata*/) = _newMaster.delegatecall(_initData);
		require(success, "failed-to-initialize-delegate");
	}
}
