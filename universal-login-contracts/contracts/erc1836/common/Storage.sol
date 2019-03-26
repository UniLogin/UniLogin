pragma solidity ^0.5.0;

import "./IMaster.sol";


contract Storage
{
	bytes32 constant internal MASTER_ID = bytes32(0x26b8c8548d7daec1fffc293834f2cee70c6b9ca8d5c456721fc1fdf9b10dd909);

	address                     internal m_master;      // Address of the master.
	bool                        internal m_initialized; // Reserved for initialization protection.
	uint256                     internal m_nonce;       // Reserved for nonce. Masters using a local nonce should synchronize during init / cleanup, and erase their local nonce.
	mapping(bytes32 => bool   ) internal m_replay;      // Reserved for replay protection. Registeres the hash of executed meta-tx that shouldn't be replayed. Persistant across updates.
	mapping(bytes32 => bytes32) internal m_store;       // Generic purpose persistent store (ERC725).

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

	event MasterChange(address indexed previousMaster, address indexed newMaster);

	function setMaster(address _newMaster, bytes memory _initData)
	internal
	{
		require(IMaster(_newMaster).masterId() == MASTER_ID, "invalid-master-uuid");

		// Update master pointer
		emit MasterChange(m_master, _newMaster);
		m_master = _newMaster;

		// Allows the run of an initialization method in the new master.
		// Will be reset to true by the initialization modifier of the initialize methode.
		m_initialized = false;

		// Call the initialize method in the new master
		(bool success, /*bytes memory returndata*/) = _newMaster.delegatecall(_initData);
		require(success, "failed-to-initialize");
	}
}
