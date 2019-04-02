pragma solidity ^0.5.2;

import "./erc1836/masters/MasterBase.sol";
import "./erc1836/interfaces/IERC1271.sol";
import "./ENSRegistered.sol";
import "./ERC1077.sol";


/* solium-disable no-empty-blocks */
contract WalletMaster is MasterBase, ENSRegistered, ERC1077, IERC1271 {
    constructor()
        ERC1077(address(0))
        public
    {}

    function owner() external view returns (address) {
        return address(this);
    }

    // Disabled upgradability: persistent nonce not sync
    function initialize(address _key) external onlyInitializing() {
        // ERC1077 → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
    }

    // Disabled upgradability: persistent nonce not sync
    function initializeWithENS(
        address _key,
        bytes32 _hashLabel,
        string calldata _name,
        bytes32 _node, ENS ens,
        FIFSRegistrar registrar,
        PublicResolver resolver) external onlyInitializing()
        {

        // ERC1077 → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
        // ENSRegistered
        registerENS(_hashLabel, _name, _node, ens, registrar, resolver);
    }

    function isValidSignature(bytes32 _data, bytes memory _signature) public view returns (bool isValid) {
        return keyExist(_data.recover(_signature));
    }
}
