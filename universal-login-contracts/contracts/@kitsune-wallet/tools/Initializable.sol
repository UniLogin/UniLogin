pragma solidity ^0.5.0;


/**
 * @title Initializable
 * @dev TODO
 */
contract Initializable {
    /**
     * @dev Storage slot with the initialization status.
     * This is the keccak-256 hash of "kitsunewallet.master.initialized".
     */
    bytes32 internal constant INITIALIZED_SLOT = 0xdd12f8451a8eb0dea8ead465a8ac468e335a28078ef025d3a1d5041ec1a90cda;

    /**
     * @dev Modifier to check whether the contract is initializing.
     */
    modifier onlyInitializing()
    {
        require(!_initialized(), "already-initialized");
        _;
        _setInitialized(true);
    }

    /**
     * @dev Returns the current initialization status.
     * @return Current initialization status
     */
    function _initialized()
    internal view returns (bool initialized)
    {
        bytes32 slot = INITIALIZED_SLOT;
        // solium-disable-next-line security/no-inline-assembly
        assembly
        {
            initialized := sload(slot)
        }
    }

    /**
     * @dev Sets the initialization status.
     * @param initialized Bool value of the initialization status.
     */
    function _setInitialized(bool initialized)
    internal
    {
        bytes32 slot = INITIALIZED_SLOT;
        // solium-disable-next-line security/no-inline-assembly
        assembly
        {
            sstore(slot, initialized)
        }
    }
}
