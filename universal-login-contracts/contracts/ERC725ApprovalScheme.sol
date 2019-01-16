pragma solidity ^0.5.2;

import "./KeyHolder.sol";
import "./ERC725.sol";


contract ERC725ApprovalScheme is KeyHolder, ERC725 {

    uint256 requiredApprovals;
    uint256 public executionNonce;

    mapping (uint256 => Execution) public executions;

    struct Execution {
        address to;
        uint256 value;
        bytes data;
        bytes32[] approvals;
    }

    constructor(bytes32 _key) KeyHolder(_key) public {
        requiredApprovals = 0;
    }

    modifier onlyUnusedKey(uint256 executionId, bytes32 sender) {
        for (uint i = 0; i < executions[executionId].approvals.length; i++) {
            require(executions[executionId].approvals[i] != sender, "Key already used.");
        }
        _;
    }

    function getExecutionApprovals(uint id) public view returns(bytes32[] memory) {
        return executions[id].approvals;
    }

    function setRequiredApprovals(uint _requiredApprovals) public onlyManagementKeyOrThisContract {
        require(keysByPurpose[MANAGEMENT_KEY].length >= _requiredApprovals, "Not enough management keys");
        requiredApprovals = _requiredApprovals;
    }

    function execute(address _to, uint256 _value, bytes memory _data)
        public
        onlyManagementOrActionKeys(bytes32(uint256(msg.sender)))
        returns(uint256 executionId)
    {
        require(_to != address(this) || keyHasPurpose(bytes32(uint256(msg.sender)), MANAGEMENT_KEY), "Management key required for actions on identity");
        return addExecution(_to, _value, _data);
    }

    function approve(uint256 _id)
        public
        onlyManagementOrActionKeys(bytes32(uint256(msg.sender)))
        onlyUnusedKey(_id, bytes32(uint256(msg.sender)))
        returns(bool shouldExecute)
    {
        require(executions[_id].to != address(0), "Invalid execution id");
        bool isManagmentAction = executions[_id].to != address(this) || keyHasPurpose(bytes32(uint256(msg.sender)), MANAGEMENT_KEY);
        require(isManagmentAction, "Management key required for actions on identity");

        executions[_id].approvals.push(bytes32(uint256(msg.sender)));
        if (executions[_id].approvals.length == requiredApprovals) {
            return doExecute(_id);
        }
        return false;
    }

    function addExecution(address _to, uint256 _value, bytes memory _data) private returns(uint256 executionId) {
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

    function doExecute(uint256 _id) private returns (bool success) {
        bytes memory _data;
        /* solium-disable-next-line security/no-call-value */
        (success, _data) = executions[_id].to.call.value(executions[_id].value)(executions[_id].data);

        if (success) {
            emit Executed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
        } else {
            emit ExecutionFailed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
        }
    }
}