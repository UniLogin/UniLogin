pragma solidity ^0.5.0;


contract Store {
    // Storage for Upgradability
    address                   internal m_master;
    bool                      internal m_initialized;
    // Generic store
    uint256                   internal m_nonce;
    mapping(bytes32 => bool ) internal m_replay;
    mapping(bytes32 => bytes) internal m_store;
}
