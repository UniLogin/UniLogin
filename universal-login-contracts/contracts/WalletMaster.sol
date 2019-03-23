pragma solidity ^0.5.2;

import "./common/MasterBase.sol";
import "./WalletContract.sol";


contract WalletMasterCopy is MasterBase, ERC1077, ENSRegistered
{
    constructor()
        ERC1077(address(0))
        public
    {}

    function initialize(address _key)
        public initialization
    {
        // ERC1077 → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
        // ERC1836 nonce
        lastNonce = m_nonce;
    }

    function initializeWithENS(address _key, bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver)
        public initialization
    {
        initialize(_key);
        // ENSRegistered
        ENSregister(_hashLabel, _name, _node, ens, registrar, resolver);
    }

    function updateDelegate(address _newMaster, bytes calldata _callback)
        external protected
    {
        // ERC1836 nonce
        m_nonce = lastNonce;

        // TODO: reset memory space

        // set next master
        setMaster(_newMaster, _callback);
    }
}
