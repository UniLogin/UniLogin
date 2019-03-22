pragma solidity ^0.5.2;

import "./common/Proxy.sol";
import "./IKeyHolder.sol";


contract ERC1077Proxy is Proxy {
    uint256 constant public MANAGEMENT_KEY = 1;
    uint256 constant public ACTION_KEY = 2;

    event KeyAdded(address indexed key, uint256 indexed purpose);

    mapping (address => IKeyHolder.Key) public keys;

    uint public keyCount;

    constructor(address _masterCopy, address _key) Proxy(_masterCopy) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        emit KeyAdded(keys[_key].key, keys[_key].purpose);
    }

}