pragma solidity ^0.5.2;

import "../interfaces/IERC1271.sol";


contract ERC1271Base is IERC1271 {
    function isValidSignature(bytes memory, bytes memory) public view returns (bytes4 magicValue);

    function uint2str(uint _num) public pure returns (string memory _uintAsString) {
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

    function getMagicValue() public pure returns(bytes4) {
        return 0x20c13b0b;
    }

    function getInvalidSignature() public pure returns(bytes4) {
        return 0xffffffff;
    }
}

