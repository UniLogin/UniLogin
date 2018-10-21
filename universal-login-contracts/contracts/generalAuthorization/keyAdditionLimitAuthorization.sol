/**
 * Authorization Contract that keeps track of how many new keys are added by a particular key and set a limit on it
 *
 * Features:
 * - Each key will be given a specific number of times they can call the function to add Key
 *
 */
pragma solidity ^0.4.24;

contract keyAdditionLimitAuthorization {

    bytes4 constant ADD_KEY_FUNC_SIG = bytes4(keccak256("addKey(bytes32 _key, uint256 _purpose, uint256 _type)"));

    ////////////////////////
    // Storage Variables
    ////////////////////////

    mapping(address => mapping(bytes32 => keyAdded)) keyAddedByIdentityAndKey;

    struct keyAdded {
        uint256 limit;
        uint256 currentCount;
    }

    ////////////////////////
    // Public Functions
    ///////////////////////

    function isActionAuthorized(
        bytes32[] authorizers,
        address executor,
        address recipient, // is "target" / "destination" a better name?
        uint256 value,
        bytes callData,
        bytes authorizationData) external returns (bool isAuthorized) {
        return actionCheck(authorizers, callData);
    }

    // This interface is not being utilized in this specific implementation so throw;
    function initAuthorization(bytes initializationData) external {
        throw;
    }

    function addAuthorizedAccount(bytes32 account, bytes initializationData) public {
        uint256 limit;

        assembly {
            limit := mload(add(initializationData, 32)) // first 32 bytes are data padding
        }

        keyAddedByIdentityAndKey[msg.sender][account].limit = limit;
    }

    function revokeAuthorizedAccount(bytes32 account, bytes initializationData) external {
        keyAddedByIdentityAndKey[msg.sender][account].limit = 0;
    }

    // Check if correct action is provided
    // if true, increment the keyAdded Count
    // else, throw
    function actionExecuted(
        bytes32[] authorizers,
        address recipient,
        uint256 value,
        bytes callData,
        bytes authorizationData) external {
        require(actionCheck(authorizers, callData));

        keyAddedByIdentityAndKey[msg.sender][authorizers[0]].currentCount++;
    }

    ////////////////////////
    // Private Functions
    ///////////////////////

    function actionCheck(bytes32[] authorizers, bytes callData) internal view returns(bool checkPassed) {
        require(authorizers.length == 1); // we only support keyAddition if one authorized party is calling it. To keep things simple
        keyAdded storage keyAddedObjCurrentAuthorizer = keyAddedByIdentityAndKey[msg.sender][authorizers[0]];
        require(keyAddedByIdentityAndKey[msg.sender][authorizers[0]].limit - keyAddedByIdentityAndKey[msg.sender][authorizers[0]].currentCount > 0); // safeMath?

        bytes4 callFunc = extractCallFunc(callData);
        require(callFunc == ADD_KEY_FUNC_SIG);
    }

    function extractCallFunc(bytes callData) internal pure returns(bytes4 callFunc) {
        assembly {
            callFunc := mload(add(callData, 32)) // first 32 bytes are data padding
        }
    }
}
