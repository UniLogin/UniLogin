pragma solidity ^0.5.0;

import "./Store.sol";
import "../masters/IMaster.sol";


contract Core is Store {
    // Events
    event MasterChange(address indexed previousMaster, address indexed newMaster);

    // Constants
    bytes32 constant MASTER_ID = bytes32(0x26b8c8548d7daec1fffc293834f2cee70c6b9ca8d5c456721fc1fdf9b10dd909);

    // Modifiers
    modifier protected() {
        require(msg.sender == address(this), "restricted-access");
        _;
    }

    modifier initialization() {
        require(!m_initialized, "already-initialized");
        _;
        m_initialized = true;
    }

    // Internal functions
    function setMaster(address _newMaster, bytes memory _initData) internal {
        require(IMaster(_newMaster).masterId() == MASTER_ID, "invalid-master-uuid");

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
