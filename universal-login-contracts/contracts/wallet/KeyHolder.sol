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

    event KeyAdded(address indexed key, uint256 indexed purpose);
    event KeyRemoved(address indexed key, uint256 indexed purpose);
    event MultipleKeysAdded(uint count);

    constructor(address _key) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = 1;
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);
    }

    function() external payable {

    }

    modifier onlyManagementOrActionKeys(address sender) {
        bool isActionKey = keyHasPurpose(sender, ACTION_KEY);
        bool isManagementKey = keyHasPurpose(sender, MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");
        _;
    }

    modifier onlyManagementKeyOrThisContract() {
        bool isManagementKey = keyHasPurpose(msg.sender, MANAGEMENT_KEY);
        require(isManagementKey || msg.sender == address(this), "Sender not permissioned");
        _;
    }

    function keyExist(address _key) public view returns(bool) {
        return keys[_key].key != address(0x0);
    }

    function keyHasPurpose(address _key, uint256 _purpose) public view returns(bool result) {
        return keys[_key].purpose == _purpose;
    }

    function addKey(address _key) public onlyManagementKeyOrThisContract returns(bool success) {
        require(keys[_key].key != _key, "Key already added");
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keyCount = keyCount.add(1);
        emit KeyAdded(keys[_key].key,  keys[_key].purpose);

        return true;
    }

    function addKeys(address[] memory _keys) public onlyManagementKeyOrThisContract returns(bool success) {
        for (uint i = 0; i < _keys.length; i++) {
            require(_keys[i] != msg.sender, "Invalid key");
            addKey(_keys[i]);
        }
        emit MultipleKeysAdded(_keys.length);
        return true;
    }

    function removeKey(address _key, uint256 _purpose) public  onlyManagementKeyOrThisContract returns(bool success) {
        require(keys[_key].purpose == _purpose, "Invalid key");

        emit KeyRemoved(keys[_key].key, keys[_key].purpose);

        delete keys[_key];
        keyCount = keyCount.sub(1);

        return true;
    }
}
