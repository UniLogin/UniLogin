pragma solidity ^0.5.2;


contract IERC1271 {
    function isValidSignature(bytes memory, bytes memory) public view returns (bytes4 magicValue);
}
