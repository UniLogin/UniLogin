pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "../openzeppelin/contracts/Initializable.sol";
import "../interfaces/IERC1271.sol";
import "../utils/ENSRegistered.sol";
import "../utils/ERC1271Base.sol";
import "./Executor.sol";



/* solium-disable no-empty-blocks */
contract Wallet is ENSRegistered, ERC1271Base, Executor, IERC721Receiver, Initializable {

    constructor() Executor(address(0)) public {
    }

    function owner() external view returns (address) {
        return address(this);
    }

    // Disabled upgradability: persistent nonce not sync
    function initialize(address _key) external initializer {
        // Executor → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        requiredSignatures = 1;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
    }

    // Disabled upgradability: persistent nonce not sync
    function initializeWithENS(
        address _key,
        bytes32 _hashLabel,
        string calldata _name,
        bytes32 _node,
        ENS ens,
        FIFSRegistrar registrar,
        PublicResolver resolver,
        uint gasPrice) external initializer
        {

        // Executor → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        requiredSignatures = 1;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
        // ENSRegistered
        registerENS(_hashLabel, _name, _node, ens, registrar, resolver);
        /* solium-disable security/no-tx-origin*/
        refund(getDeploymentGasUsed(), gasPrice, address(0), tx.origin);
    }

    function isValidSignature(bytes memory _data, bytes memory _signature) public view returns (bytes4) {
        if (keyExist(getMessageHash(_data).recover(_signature))) {
            return getMagicValue();
        } else {
            return getInvalidSignature();
        }
    }

    function onERC721Received(address, address, uint256, bytes memory) public returns (bytes4 magicValue) {
        return this.onERC721Received.selector;
    }

    function getMessageHash(bytes memory _data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", uint2str(_data.length), _data));
    }

    function getDeploymentGasUsed() private pure returns(uint) {
        return 500000;
    }
}
