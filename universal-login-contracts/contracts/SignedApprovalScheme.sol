pragma solidity ^0.4.24;

import "./KeyHolder.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract SignedApprovalScheme is KeyHolder {
    using ECRecovery for bytes32;
    using SafeMath for uint;

    uint256 requiredApprovals;
    uint256 public executionNonce;

    mapping (uint256 => Execution) public executions;

    event ExecutionRequested(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Executed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event ExecutionFailed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);

    struct Execution {
        address to;
        uint256 value;
        bytes data;
        bytes32[] approvals;
        address gasToken;
        uint gasPrice;
        uint gasLimit;
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

    function getExecutionApprovals(uint id) public view returns(bytes32[]) {
        return executions[id].approvals;
    }

    function setRequiredApprovals(uint _requiredApprovals) public onlyManagementKeyOrThisContract {
        require(keysByPurpose[MANAGEMENT_KEY].length >= _requiredApprovals, "Not enough management keys");
        requiredApprovals = _requiredApprovals;
    } 

    function getSignerForExecutions(
        address _to, address _from, uint256 _value, bytes _data, uint256 _nonce, address _gasToken, uint _gasPrice, uint _gasLimit, bytes extraData, bytes _messageSignature
        ) 
        public pure returns (bytes32) 
    {
        bytes32 messageHash = keccak256(abi.encodePacked(_to, _from, _value, _data, _nonce, _gasToken, _gasPrice, _gasLimit, extraData));
        return bytes32(messageHash.toEthSignedMessageHash().recover(_messageSignature));
    }

    function getSignerForApprovals(uint256 _id, bytes _messageSignature) public pure returns(bytes32) {
        bytes32 messageHash = keccak256(abi.encodePacked((_id)));
        return bytes32(messageHash.toEthSignedMessageHash().recover(_messageSignature));
    }

    function executeSigned(
        address _to, uint256 _value, bytes _data, uint256 _nonce, address _gasToken, uint _gasPrice, uint _gasLimit, bytes extraData, bytes _messageSignature
        )
        public
        onlyManagementOrActionKeys(getSignerForExecutions(_to, address(this), _value, _data, _nonce, _gasToken, _gasPrice, _gasLimit, extraData, _messageSignature))
        returns(uint256 executionId)
    {
        bytes32 signer = getSignerForExecutions(_to, address(this), _value, _data, _nonce, _gasToken, _gasPrice, _gasLimit, extraData, _messageSignature);
        require(_to != address(this) || keyHasPurpose(signer, MANAGEMENT_KEY), "Management key required for actions on identity");

        return addSignedExecution(_to, _value, _data, _nonce, _gasToken, _gasPrice, _gasLimit);
    }

    function approveSigned(uint256 _id, bytes _messageSignature)
        public
        onlyManagementOrActionKeys(getSignerForApprovals(_id, _messageSignature))
        onlyUnusedKey(_id, getSignerForApprovals(_id, _messageSignature))
        returns(bool shouldExecute)
    {
        require(executions[_id].to != address(0), "Invalid execution id");
        bytes32 signer = getSignerForApprovals(_id, _messageSignature);
        require(executions[_id].to != address(this) || keyHasPurpose(signer, MANAGEMENT_KEY), "Management key required for actions on identity");

        executions[_id].approvals.push(bytes32(msg.sender));
        return attemptExecution(_id);
    }

    function addSignedExecution(address _to, uint256 _value, bytes _data, uint256 _nonce, address _gasToken, uint _gasPrice, uint _gasLimit) 
        private 
        returns(uint256 executionId) 
    {
        require(_to != address(0), "Invalid 'to' address");
        require(executionNonce == _nonce, "Invalid execution nonce");

        executions[executionNonce].to = _to;
        executions[executionNonce].value = _value;
        executions[executionNonce].data = _data;
        executions[executionNonce].approvals = new bytes32[](0);
        executions[executionNonce].gasToken = _gasToken;
        executions[executionNonce].gasPrice = _gasPrice;
        executions[executionNonce].gasLimit = _gasLimit;

        emit ExecutionRequested(executionNonce, _to, _value, _data);

        attemptExecution(executionNonce);
        executionNonce++;
        return executionNonce - 1;
    }

    function attemptExecution(uint256 executionNonce) private returns(bool success) {
        if (executions[executionNonce].approvals.length == requiredApprovals) {
            return doExecute(executionNonce);
        }
        return false;
    }

    function doExecute(uint256 _id) private returns (bool success) {
        uint256 startingGas = gasleft();
        /* solium-disable-next-line security/no-call-value */
        success = executions[_id].to.call.value(executions[_id].value)(executions[_id].data);
        uint256 gasUsed = startingGas.sub(gasleft());
        if (success) {
            refund(_id, gasUsed);
            emit Executed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
        } else {
            emit ExecutionFailed(_id, executions[_id].to, executions[_id].value, executions[_id].data);
        }
    }     

    function refund(uint256 _id, uint256 _gasUsed) private {
        if (executions[_id].gasToken != address(0)) {
            StandardToken token = StandardToken(executions[_id].gasToken);
            token.transfer(msg.sender, _gasUsed.mul(executions[_id].gasPrice));
        } 
    }
}