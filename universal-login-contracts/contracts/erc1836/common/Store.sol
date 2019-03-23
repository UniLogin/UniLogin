pragma solidity ^0.5.0;


/* solium-disable mixedcase */

// Modified ERC1836 ** Minimal store without persistante / upgradability
contract Store {
    // Storage for Upgradability

    address                   internal m_master;
    bool                      internal m_initialized;
}
