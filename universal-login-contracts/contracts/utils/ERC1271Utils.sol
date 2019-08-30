pragma solidity ^0.5.2;


contract ERC1271Utils {
    function getMagicValue() public pure returns(bytes4) {
        return 0x20c13b0b;
    }

    function getInvalidSignature() public pure returns(bytes4) {
        return 0xffffffff;
    }
}

