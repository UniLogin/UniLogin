pragma solidity ^0.5.0;


contract IERC1271 {
    function isValidSignature(bytes32, bytes memory) public view returns (bool isValid);
}
