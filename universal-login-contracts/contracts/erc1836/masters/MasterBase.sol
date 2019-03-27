pragma solidity ^0.5.0;

import "./IMaster.sol";
import "../common/Core.sol";


contract MasterBase is IMaster, Core {
    function master() external view returns (address) {
        return m_master;
    }

    function masterId() external pure returns (bytes32) {
        return MASTER_ID;
    }
}
