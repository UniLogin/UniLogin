pragma solidity ^0.5.2;


contract Snippet {

    struct Key {
        uint256 a; 
        address b;
    }
    
    mapping (address => Key) public keys;
    //Key public k;

    function test(address u, uint256 v) public  returns(bool success) {

        delete keys[u];

        return true;
    }

}
