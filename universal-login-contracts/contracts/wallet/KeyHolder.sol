pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract KeyHolder {
    using SafeMath for uint;

    uint256 constant public MANAGEMENT_KEY = 1;
    uint256 constant public ACTION_KEY = 2;

    struct Key {
        uint256 purpose;
        address key;
    }

    mapping (address => Key) public keys;

    uint public keyCount;

    event KeyAdded(address indexed key);
    event KeyRemoved(address indexed key);
    event MultipleKeysAdded(uint count);

    constructor(address _key) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        emit KeyAdded(keys[_key].key);
    }

    function() external payable {

    }

    modifier onlyAuthorised() {
        require(keyExist(msg.sender) || msg.sender == address(this), "Sender not permissioned");
        _;
    }

    function keyExist(address _key) public view returns(bool) {
        return keys[_key].key != address(0x0);
    }

    function keyHasPurpose(address _key, uint256 _purpose) public view returns(bool result) {
        return keys[_key].purpose == _purpose;
    }

    function addKey(address _key) public onlyAuthorised returns(bool success) {
        require(keys[_key].key != _key, "Key already added");
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = keyCount.add(1);
        emit KeyAdded(keys[_key].key);

        return true;
    }

    function addKeys(address[] memory _keys) public onlyAuthorised returns(bool success) {
        for (uint i = 0; i < _keys.length; i++) {
            require(_keys[i] != msg.sender, "Invalid key");
            addKey(_keys[i]);
        }
        emit MultipleKeysAdded(_keys.length);
        return true;
    }

    function removeKey(address _key) public  onlyAuthorised returns(bool success) {
        emit KeyRemoved(keys[_key].key);

        delete keys[_key];
        keyCount = keyCount.sub(1);

        return true;
    }
}
