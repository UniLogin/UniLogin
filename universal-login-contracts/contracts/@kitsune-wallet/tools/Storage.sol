pragma solidity ^0.5.0;

/**
 * @title Storage
 * @dev TODO
 */
contract Storage
{
	/**
	 * @dev Slots used as a base for the derivation of keys.
	 * Storage slot is the keccak-256 hash of "kitsunewallet.master.storage.internal".
	 * Public  slot is the keccak-256 hash of "kitsunewallet.master.storage.public".
	 */
	bytes32 internal constant STORAGE_SLOT = 0x7e6e8eebcd5b6b5d186f5683063f313f778eae8c96967288ed17857d8f18d2ae;
	bytes32 internal constant PUBLIC_SLOT  = 0x3cc2824d7742370c3125fd92433a4927eeb240f330c586dce81140c5f96b1d1d;

	/**
	 * @dev Get value in store.
	 * @param key index to retreive
	 * @return bytes32 content stored at key
	 */
	function _get(bytes32 key)
	internal view returns (bytes32 value)
	{
		bytes32 slot = keccak256(abi.encode(STORAGE_SLOT, key));
		assembly
		{
			value := sload(slot)
		}
	}

	/**
	 * @dev Get value in public store.
	 * @param key index to retreive
	 * @return bytes32 content stored at key
	 */
	function _getData(bytes32 key)
	internal view returns (bytes32 value)
	{
		bytes32 slot = keccak256(abi.encode(PUBLIC_SLOT, key));
		assembly
		{
			value := sload(slot)
		}
	}

	/**
	 * @dev Sets value in store.
	 * @param key index to use
	 * @param value content to store at key
	 */
	function _set(bytes32 key, bytes32 value)
	internal
	{
		bytes32 slot = keccak256(abi.encode(STORAGE_SLOT, key));
		assembly
		{
			sstore(slot, value)
		}
	}

	/**
	 * @dev Sets value in store.
	 * @param key index to use
	 * @param value content to store at key
	 */
	function _setData(bytes32 key, bytes32 value)
	internal
	{
		bytes32 slot = keccak256(abi.encode(PUBLIC_SLOT, key));
		assembly
		{
			sstore(slot, value)
		}
	}
}
