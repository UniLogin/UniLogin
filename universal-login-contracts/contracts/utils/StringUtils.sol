pragma solidity ^0.5.2;


contract StringUtils {
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
}

