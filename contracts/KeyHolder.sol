pragma solidity ^0.4.24;

import "./ERC725.sol";


contract KeyHolder is ERC725 {

    uint256 public executionNonce;
    uint256 neededApprovals;
    struct Execution {
        address to;
        uint256 value;
        bytes data;
        bytes32[] approvals;
    }

    mapping (bytes32 => Key) public keys;
    mapping (uint256 => bytes32[]) keysByPurpose;
    mapping (uint256 => Execution) public executions;


    constructor(bytes32 _key, uint256 _neededApprovals) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keys[_key].keyType = ECDSA_TYPE;

        neededApprovals = _neededApprovals;

        keysByPurpose[MANAGEMENT_KEY].push(_key);

        emit KeyAdded(keys[_key].key,  keys[_key].purpose, keys[_key].keyType);
    }

    modifier onlyManagementOrActionKeys() {
        bool isActionKey = keyHasPurpose(bytes32(msg.sender), ACTION_KEY);
        bool isManagementKey = keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");
        _;
    }
    
    modifier onlyUnusedKey(uint256 executionId) {
        for (uint i = 0; i < executions[executionId].approvals.length; i++) {
            require(executions[executionId].approvals[i] != bytes32(msg.sender), "Key already used.");
        }
        _;
    }

    function getKey(bytes32 _key) public view returns(uint256 purpose, uint256 keyType, bytes32 key) {
        return (keys[_key].purpose, keys[_key].keyType, keys[_key].key);
    }

    function getKeyPurpose(bytes32 _key) public view returns(uint256 purpose) {
        return keys[_key].purpose;
    }

    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[]) {
        return keysByPurpose[_purpose];
    }

    function getExecutionApprovals(uint executionId) public view returns(bytes32[]) {
        return executions[executionId].approvals;
    }

    function addKey(bytes32 _key, uint256 _purpose, uint256 _type) public returns(bool success) {
        require(keys[_key].key != _key, "Key already added");
        require(keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY), "Sender not permissioned");

        keys[_key].key = _key;
        keys[_key].purpose = _purpose;
        keys[_key].keyType = _type;

        keysByPurpose[_purpose].push(_key);

        emit KeyAdded(keys[_key].key,  keys[_key].purpose, keys[_key].keyType);

        return true;
    }

    function keyHasPurpose(bytes32 _key, uint256 _purpose) public view returns(bool result) {
        return keys[_key].purpose == _purpose;
    }

    function removeKey(bytes32 _key, uint256 _purpose) public returns(bool success) {
        bool isActionKey = keyHasPurpose(bytes32(msg.sender), ACTION_KEY);
        bool isManagementKey = keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");

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

    function execute(address _to, uint256 _value, bytes _data) public returns (uint256 executionId) {
        require(_to != address(0), "Invalid to address");
        require(_to != address(this) || keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY), "Management key required for actions on identity");

        bool isActionKey = keyHasPurpose(bytes32(msg.sender), ACTION_KEY);
        bool isManagementKey = keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");

        executions[executionNonce].to = _to;
        executions[executionNonce].value = _value;
        executions[executionNonce].data = _data;
        executions[executionNonce].approvals = new bytes32[](0);

        emit ExecutionRequested(executionNonce, _to, _value, _data);

        executionNonce++;
        return executionNonce - 1;
    }

    function approve(uint256 executionId) public onlyManagementOrActionKeys onlyUnusedKey(executionId) returns(bool success) {
        require(executions[executionId].to != address(0), "Invalid execution Id");

        executions[executionId].approvals.push(bytes32(msg.sender));
        success = (executions[executionId].approvals.length == neededApprovals);
        if (success) {
            return doExecute(executionId);
        } 
    }

    function doExecute(uint256 executionId) private returns (bool success) {
        success = executions[executionId].to.call(executions[executionId].data);
        if (success) {
            emit Executed(executionId, executions[executionId].to, executions[executionId].value, executions[executionId].data);
        } else {
            emit ExecutionFailed(executionId, executions[executionId].to, executions[executionId].value, executions[executionId].data);
        }
    }
}