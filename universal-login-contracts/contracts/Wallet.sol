pragma solidity ^0.5.2;

import "./ENSRegistered.sol";
import "./ERC1077.sol";
import "./IERC1271.sol";


contract Wallet is ENSRegistered, ERC1077, IERC1271 {
    constructor(
        address _key, bytes32 _hashLabel, string memory _name, bytes32 _node, ENS ens, FIFSRegistrar registrar, PublicResolver resolver)
        payable public
        ERC1077(_key)
    {
        ENSregister(_hashLabel, _name, _node, ens, registrar, resolver);
    }

    function isValidSignature(bytes32 _data, bytes memory _signature)
        public view returns (bool isValid)
    {
        return keyExist(_data.recover(_signature));
    }
}
