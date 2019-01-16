pragma solidity ^0.5.2;
import "./ERC725KeyHolder.sol";


contract KeyHolder is ERC725KeyHolder {
    mapping (bytes32 => Key) public keys;
    mapping (uint256 => bytes32[]) keysByPurpose;

    constructor(bytes32 _key) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keys[_key].keyType = ECDSA_TYPE;

        keysByPurpose[MANAGEMENT_KEY].push(_key);

        emit KeyAdded(keys[_key].key,  keys[_key].purpose, keys[_key].keyType);
    }

    function() external payable {

    }

    modifier onlyManagementOrActionKeys(bytes32 sender) {
        bool isActionKey = keyHasPurpose(sender, ACTION_KEY);
        bool isManagementKey = keyHasPurpose(sender, MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");
        _;
    }

    modifier onlyManagementKeyOrThisContract() {
        bool isManagementKey = keyHasPurpose(bytes32(uint256(msg.sender)), MANAGEMENT_KEY);
        require(isManagementKey || msg.sender == address(this), "Sender not permissioned");
        _;
    }

    function keyExist(bytes32 _key) public view returns(bool) {
        return keys[_key].key != bytes32(0x0);
    }

    function getKey(bytes32 _key) public view returns(uint256 purpose, uint256 keyType, bytes32 key) {
        return (keys[_key].purpose, keys[_key].keyType, keys[_key].key);
    }

    function getKeyPurpose(bytes32 _key) public view returns(uint256 purpose) {
        return keys[_key].purpose;
    }

    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[] memory) {
        return keysByPurpose[_purpose];
    }

    function keyHasPurpose(bytes32 _key, uint256 _purpose) public view returns(bool result) {
        return keys[_key].purpose == _purpose;
    }

    function addKey(bytes32 _key, uint256 _purpose, uint256 _type) public onlyManagementKeyOrThisContract returns(bool success) {
        require(keys[_key].key != _key, "Key already added");

        keys[_key].key = _key;
        keys[_key].purpose = _purpose;
        keys[_key].keyType = _type;

        keysByPurpose[_purpose].push(_key);

        emit KeyAdded(keys[_key].key,  keys[_key].purpose, keys[_key].keyType);

        return true;
    }

    function addKeys(bytes32[] memory _keys, uint256[] memory _purposes, uint256[] memory _types) public onlyManagementKeyOrThisContract returns(bool success) {
        require(_keys.length == _purposes.length && _keys.length == _types.length, "Unequal argument set lengths");
        for (uint i = 0; i < _keys.length; i++) {
            addKey(_keys[i], _purposes[i], _types[i]);
        }
        emit MultipleKeysAdded(_keys.length);
        return true;
    }

    function removeKey(bytes32 _key, uint256 _purpose) public  onlyManagementKeyOrThisContract returns(bool success) {
        require(keys[_key].purpose != MANAGEMENT_KEY || keysByPurpose[MANAGEMENT_KEY].length > 1, "Can not remove management key");
        require(keys[_key].purpose == _purpose, "Invalid key");

        emit KeyRemoved(keys[_key].key, keys[_key].purpose, keys[_key].keyType);

        delete keys[_key];

        for (uint i = 0; i < keysByPurpose[_purpose].length; i++) {
            if (keysByPurpose[_purpose][i] == _key) {
                keysByPurpose[_purpose][i] = keysByPurpose[_purpose][keysByPurpose[_purpose].length - 1];
                delete keysByPurpose[_purpose][keysByPurpose[_purpose].length - 1];
                keysByPurpose[_purpose].length--;
            }
        }

        return true;
    }

    event MultipleKeysAdded(uint count);
}
