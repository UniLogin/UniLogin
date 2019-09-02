pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "../openzeppelin/contracts/Initializable.sol";
import "../interfaces/IERC1271.sol";
import "../utils/ENSUtils.sol";
import "../utils/ERC1271Utils.sol";
import "../utils/StringUtils.sol";
import "./Executor.sol";
import "./KeyHolder.sol";


/* solium-disable no-empty-blocks */
contract Wallet is ENSUtils, Executor, KeyHolder, ERC1271Utils, StringUtils, IERC721Receiver, Initializable, IERC1271 {

    constructor() KeyHolder(address(0)) public {
    }

    function owner() external view returns (address) {
        return address(this);
    }

    function() external payable {

    }

    // Disabled upgradability: persistent nonce not sync
    function initialize(address _key) external initializer {
        // Executor → KeyHolder
        keys[_key] = true;
        keyCount = 1;
        requiredSignatures = 1;
        emit KeyAdded(_key);
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
        keys[_key] = true;
        keyCount = 1;
        requiredSignatures = 1;
        emit KeyAdded(_key);
        // ENSUtils
        registerENS(_hashLabel, _name, _node, ens, registrar, resolver);
        /* solium-disable security/no-tx-origin*/
        refund(getDeploymentGasUsed(), gasPrice, address(0), tx.origin);
    }

    function setRequiredSignatures(uint _requiredSignatures) public onlyAuthorised {
        require(_requiredSignatures != requiredSignatures && _requiredSignatures > 0, "Invalid required signature");
        require(_requiredSignatures <= keyCount, "Signatures exceed owned keys number");
        requiredSignatures = _requiredSignatures;
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

    function areSignaturesValid(bytes memory signatures, bytes32 dataHash) private view returns(bool) {
        // There cannot be an owner with address 0.
        uint sigCount = signatures.length / 65;
        address lastSigner = address(0);
        address signer;
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 i;
        for (i = 0; i < sigCount; i++) {
            /* solium-disable-next-line security/no-inline-assembly*/
            assembly {
                let signaturePos := mul(0x41, i)
                r := mload(add(signatures, add(signaturePos, 0x20)))
                s := mload(add(signatures, add(signaturePos, 0x40)))
                v := and(mload(add(signatures, add(signaturePos, 0x41))), 0xff)
            }
            signer = ecrecover(dataHash, v, r, s);
            if (!keyExist(signer) || signer <= lastSigner) {
                return false;
            }

            lastSigner = signer;
        }
        return true;
    }
}
