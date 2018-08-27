pragma solidity ^0.4.24;

import "./ERC725.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";


contract KeyHolder is ERC725 {
    using ECRecovery for bytes32;

    uint256 public executionNonce;
    uint256 requiredApprovals;
    struct Execution {
        address to;
        uint256 value;
        bytes data;
        bytes32[] approvals;
    }

    mapping (bytes32 => Key) public keys;
    mapping (uint256 => bytes32[]) keysByPurpose;
    mapping (uint256 => Execution) public executions;


    constructor(bytes32 _key) public {
        keys[_key].key = _key;
        keys[_key].purpose = MANAGEMENT_KEY;
        keys[_key].keyType = ECDSA_TYPE;

        requiredApprovals = 1;

        keysByPurpose[MANAGEMENT_KEY].push(_key);

        emit KeyAdded(keys[_key].key,  keys[_key].purpose, keys[_key].keyType);
    }

    function() public payable {

    }

    modifier onlyManagementOrActionKeys(bytes32 sender) {
        bool isActionKey = keyHasPurpose(sender, ACTION_KEY);
        bool isManagementKey = keyHasPurpose(sender, MANAGEMENT_KEY);
        require(isActionKey || isManagementKey, "Invalid key");
        _;
    }

    modifier onlyManagementKeyOrThisContract() {
        bool isManagementKey = keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY);
        require(isManagementKey || msg.sender == address(this), "Sender not permissioned");
        _;
    }

    modifier onlyUnusedKey(uint256 executionId, bytes32 sender) {
        for (uint i = 0; i < executions[executionId].approvals.length; i++) {
            require(executions[executionId].approvals[i] != sender, "Key already used.");
        }
        _;
    }

    function getSigner(address _to, uint256 _value, bytes _data, bytes _messageSignature) public pure returns (bytes32) {
        bytes32 messageHash = keccak256(abi.encodePacked(_to, _value, _data));
        return bytes32(messageHash.toEthSignedMessageHash().recover(_messageSignature));
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

    function getExecutionApprovals(uint id) public view returns(bytes32[]) {
        return executions[id].approvals;
    }

    function keyHasPurpose(bytes32 _key, uint256 _purpose) public view returns(bool result) {
        return keys[_key].purpose == _purpose;
    }

    function setRequiredApprovals(uint _requiredApprovals) public onlyManagementKeyOrThisContract {
        require(keysByPurpose[MANAGEMENT_KEY].length >= _requiredApprovals, "Not enough management keys");
        requiredApprovals = _requiredApprovals;
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

    function removeKey(bytes32 _key, uint256 _purpose) public  onlyManagementKeyOrThisContract returns(bool success) {
        require(keys[_key].purpose != MANAGEMENT_KEY || keysByPurpose[MANAGEMENT_KEY].length > requiredApprovals, "Can not remove management key");
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

    function execute(address _to, uint256 _value, bytes _data)
        public
        onlyManagementOrActionKeys(bytes32(msg.sender))
        returns(uint256 executionId)
    {
        require(_to != address(this) || keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY), "Management key required for actions on identity");
        return addExecution(_to, _value, _data);
    }

    function executeSigned(address _to, uint256 _value, bytes _data, bytes _messageSignature)
        public
        onlyManagementOrActionKeys(getSigner(_to, _value, _data, _messageSignature))
        returns(uint256 executionId)
    {
        bytes32 signer = getSigner(_to, _value, _data, _messageSignature);
        require(_to != address(this) || keyHasPurpose(signer, MANAGEMENT_KEY), "Management key required for actions on identity");

        return addExecution(_to, _value, _data);
    }

    function approve(uint256 id)
        public
        onlyManagementOrActionKeys(bytes32(msg.sender))
        onlyUnusedKey(id, bytes32(msg.sender))
        returns(bool shouldExecute)
    {
        require(executions[id].to != address(0), "Invalid execution id");
        require(executions[id].to != address(this) || keyHasPurpose(bytes32(msg.sender), MANAGEMENT_KEY), "Management key required for actions on identity");

        executions[id].approvals.push(bytes32(msg.sender));
        if (executions[id].approvals.length == requiredApprovals) {
            return doExecute(id);
        }
        return false;
    }

    function approveSigned(uint256 id, bytes _messageSignature)
        public
        onlyManagementOrActionKeys(getSigner(executions[id].to, executions[id].value, executions[id].data, _messageSignature))
        onlyUnusedKey(id, getSigner(executions[id].to, executions[id].value, executions[id].data, _messageSignature))
        returns(bool shouldExecute)
    {
        require(executions[id].to != address(0), "Invalid execution id");
        bytes32 signer = getSigner(executions[id].to, executions[id].value, executions[id].data, _messageSignature);
        require(executions[id].to != address(this) || keyHasPurpose(signer, MANAGEMENT_KEY), "Management key required for actions on identity");

        executions[id].approvals.push(bytes32(msg.sender));
        if (executions[id].approvals.length == requiredApprovals) {
            return doExecute(id);
        }
        return false;
    }

    function addExecution(address _to, uint256 _value, bytes _data) private returns(uint256 executionId) {
        require(_to != address(0), "Invalid 'to' address");
        executions[executionNonce].to = _to;
        executions[executionNonce].value = _value;
        executions[executionNonce].data = _data;
        executions[executionNonce].approvals = new bytes32[](0);

        emit ExecutionRequested(executionNonce, _to, _value, _data);

        if (executions[executionNonce].approvals.length == requiredApprovals) {
            doExecute(executionNonce);
        }
        executionNonce++;
        return executionNonce - 1;
    }

    function doExecute(uint256 id) private returns (bool success) {
        /* solium-disable-next-line security/no-call-value */
        success = executions[id].to.call.value(executions[id].value)(executions[id].data);
        if (success) {
            emit Executed(id, executions[id].to, executions[id].value, executions[id].data);
        } else {
            emit ExecutionFailed(id, executions[id].to, executions[id].value, executions[id].data);
        }
    }
}