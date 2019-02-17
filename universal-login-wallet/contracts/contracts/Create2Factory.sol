pragma solidity >=0.4.25 <0.6.0;
library ECDSA {
    /**
     * @dev Recover signer address from a message by using their signature
     * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
     * @param signature bytes signature, the signature is generated using web3.eth.sign()
     */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

    /**
     * toEthSignedMessageHash
     * @dev prefix a bytes32 value with "\x19Ethereum Signed Message:"
     * and hash the result
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}

contract Create2Factory {
    bytes public contractCode;
    address public contractAddress;
    using ECDSA for bytes32;
    
    function setContractCode(bytes memory _contractCode) public {
        contractCode = _contractCode;
    }

    function deployContract(
        address _signer,
        bytes32 _salt,
        bytes memory _signature
    )
        public
    {
        bytes32 msgHash = keccak256(abi.encodePacked(address(this), _salt));
        address signer = msgHash.toEthSignedMessageHash().recover(_signature);
        require(signer == _signer, "signer == _signer");
        _createContract(_salt, _signer);
    }

    function _createContract(bytes32 _salt, address _signer) internal returns (address _contract) {
        bytes memory _contractCode = contractCode;
        bytes32 actualSalt = keccak256(abi.encodePacked(_salt, _signer));
    
        assembly {
            _contract := create2(0, add(_contractCode, 0x20), mload(_contractCode), actualSalt)
            if iszero(extcodesize(_contract)) {revert(0, 0)}
        }
        contractAddress = _contract;
    }
    
    function computeContractAddress(bytes32 _salt, address _signer) public view returns (address _contractAddress) {
        bytes32 actualSalt = keccak256(abi.encodePacked(_salt, _signer));
        bytes32 contractCodeHash = keccak256(abi.encodePacked(contractCode)); // Double check this. Not sure if this is right

        bytes32 _data = keccak256(
            abi.encodePacked(
            bytes1(0xff),
            address(this),
            actualSalt,
            contractCodeHash
            )
        );
        _contractAddress = address(bytes20(_data << 96));
    }

    function isContract(address account) public view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }
        return size > 0;
    }
}