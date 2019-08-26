pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "../proxy/MasterBase.sol";
import "../interfaces/IERC1271.sol";
import "../utils/ENSRegistered.sol";
import "./ERC1077.sol";


/* solium-disable no-empty-blocks */
contract WalletMaster is MasterBase, ENSRegistered, ERC1077, IERC1271, IERC721Receiver {
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
        PublicResolver resolver) external onlyInitializing()
        {

        // ERC1077 → KeyHolder
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        requiredSignatures = 1;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
        // ENSRegistered
        registerENS(_hashLabel, _name, _node, ens, registrar, resolver);
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

    function uint2str(uint _num) internal pure returns (string memory _uintAsString) {
        if (_num == 0) {
            return "0";
        }
        uint i = _num;
        uint j = _num;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (i != 0) {
            bstr[k--] = byte(uint8(48 + i % 10));
            i /= 10;
        }
        return string(bstr);
    }

    function getMagicValue() private pure returns(bytes4) {
        return 0x20c13b0b;
    }

    function getInvalidSignature() private pure returns(bytes4) {
        return 0xffffffff;
    }
}
