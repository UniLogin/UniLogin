pragma solidity ^0.4.24;

interface authorizationInterface {
    /**
     * @notice Given a list of authorizers and an action ,
     * Checks whether the enough authorizedAccounts has been given in order to execute the action
     * @param authorizers array of address that have approved
     * @param executor the contract that'll be executing the action
     * @param recipient the recipient of the call
     * @param value amount of ETH to send with the call
     * @param callData data field of the call
     * @param authorizationData optional field that helps authorization contract determine which authorized Action
     *                              in the cases where authorizers have more than one authorized action
     * @return isAuthorized a boolean that show whether the authorizers are authorized to do the action provided.
     */
    function isActionAuthorized(
        bytes32[] authorizers,
        address executor,
        address recipient, // is "target" / "destination" a better name?
        uint256 value,
        bytes callData,
        bytes authorizationData) external returns (bool isAuthorized);

    /**
     * @notice Create a new Authorization
     * @dev Note: This is an optional function, simple authorization logic will not need this function.
     * @param initializationData data to create new authorization
     */
    function initAuthorization(bytes initializationData) external;

    /**
     * @notice add a new authorized account
     */
    function addAuthorizedAccount(bytes32 account, bytes initializationData) external;

    /**
     * @notice revoke an existing authorized account
     *
     */
    function revokeAuthorizedAccount(bytes32 account, bytes initializationData) external;

    /**
     * @notice Updates the records when the action has been Executed
     * @dev This is the same parameter list as isActionAuthorized but assumes that executor is msg.sender
     * There are options to handle when an invalid parameters have been passed in,
     * 1. Ignore it
     * 2. Revert the transaction
     * @param authorizers array of address that have approved
     * @param recipient the recipient of the call
     * @param value amount of ETH to send with the call
     * @param callData data field of the call
     * @param authorizationData optional field that helps authorization contract determine which authorized Action
     *                              in the cases where authorizers have more than one authorized action
     */
    function actionExecuted(
        bytes32[] authorizers,
        address recipient,
        uint256 value,
        bytes callData,
        bytes authorizationData) external;
}
