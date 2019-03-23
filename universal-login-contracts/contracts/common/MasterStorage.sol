pragma solidity ^0.5.0;

import "./IMaster.sol";


contract MasterStorage {
    // Address of the master.
    address internal m_master;
    // Reserved for nonce. Delegate using a local nonce should synchronize during init / cleanup, and erase their local nonce.
    uint256 internal m_nonce;
    // Reserved for replay protection. Registeres the hash of executed meta-tx that shouldn't be replayed. Persistant across updates.
    mapping(bytes32 => bool) internal m_replay;
    // Generic purpose persistent store (ERC725).
    mapping(bytes32 => bytes32) internal m_store;
    // Reserved for initialization protection.
    bool internal m_initialized;

    event MasterChange(address indexed previousMaster, address indexed newMaster);

    modifier protected() {
        require(msg.sender == address(this), "restricted-access");
        _;
    }

    modifier initialization() {
        require(!m_initialized, "already-initialized");
        m_initialized = true;
        _;
    }

    function setMaster(address _newMaster, bytes memory _initData) internal {
        require(IMaster(_newMaster).UUID() == 0x26b8c8548d7daec1fffc293834f2cee70c6b9ca8d5c456721fc1fdf9b10dd909, "invalid-master-uuid");

        // Update master pointer
        emit MasterChange(m_master, _newMaster);
        m_master = _newMaster;

        // Allows the run of an initialization method in the new master.
        // Will be reset to true by the initialization modifier of the initialize methode.
        m_initialized = false;

        // Call the initialize method in the new master
				// solium-disable-next-line security/no-low-level-calls
        (bool success, /*bytes memory returndata*/) = _newMaster.delegatecall(_initData);
        require(success, "failed-to-initialize");
    }
}
