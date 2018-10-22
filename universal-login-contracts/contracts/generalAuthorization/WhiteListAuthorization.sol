/**
 * Authorization Contract that give permission to interact with only whiteListed Addresses
 *
 * Features:
 * Permission Provider(identities) can set general White Listed Addresses which applies to all keys
 * Permission Provider(identities) can give certain keys permission to specific White listed Addresses
 */

pragma solidity ^0.4.24;

contract WhiteListAuthorization {

    ////////////////////////
    // Storage Variables
    ////////////////////////

    // General White Listed Address that applies to all keys
    // Identity(msg.sender) => whiteListAddress => bool
    mapping (address => mapping(address => bool)) generalWhiteListedAddressByIdentity;

    // Specific white listed for each particular key
    // Identity(msg.sender) => key => whiteListAddress => bool
    mapping (address => mapping(bytes32 => mapping(address => bool))) whiteListedAddressByIdentityAndKey;

    ////////////////////////
    // Public Functions
    ///////////////////////


    function isActionAuthorized(
        bytes32[] authorizers,
        address executor,
        address recipient, // is "target" / "destination" a better name?
        uint256 value,
        bytes callData,
        bytes authorizationData) view external returns (bool isAuthorized) {
        // check whether the recipient is one of the whiteListedAddress

        // first check the generalList
        if (generalWhiteListedAddressByIdentity[msg.sender][recipient]) {
            return true;
        } else {
            // then go through all the authorizers, see if one of them is allowed to call the recipient
            for (uint i = 0; i < authorizers.length; i++) {
                if (whiteListedAddressByIdentityAndKey[msg.sender][authorizers[i]][recipient]) {
                    return true;
                }
            }
        }

        return false;
    }

    // This specific authorization Contract is not utilizing the this function of the interface
    function initAuthorization(bytes initializationData) pure external {
        throw;
    }

    // set the general white list address for the msg.sender
    function addGeneralWhiteListedAddress(bytes initializationData) external {
        address[] memory addressList = extractAddresses(initializationData);

        for (uint256 i = 0; i < addressList.length; i++) {
            generalWhiteListedAddressByIdentity[msg.sender][addressList[i]] = true;
        }
    }

    // set the general white list address for the msg.sender
    function removeGeneralWhiteListedAddress(bytes initializationData) external {
        address[] memory addressList = extractAddresses(initializationData);

        for (uint256 i = 0; i < addressList.length; i++) {
            generalWhiteListedAddressByIdentity[msg.sender][addressList[i]] = true;
        }
    }

    // add white listed Addresses only for account provided
    function addAuthorizedAccount(bytes32 account, bytes initializationData) external {
        address[] memory addressList = extractAddresses(initializationData);

        for (uint256 i = 0; i < addressList.length; i++) {
            whiteListedAddressByIdentityAndKey[msg.sender][account][addressList[i]] = false;
        }
    }

    // remove white listed Addresses only for account provided
    function revokeAuthorizedAccount(bytes32 account, bytes initializationData) external {
        address[] memory addressList = extractAddresses(initializationData);

        for (uint256 i = 0; i < addressList.length; i++) {
            whiteListedAddressByIdentityAndKey[msg.sender][account][addressList[i]] = false;
        }
    }

    // Do nothing because this authorization doesn't need to update the state when an action is executed
    function actionExecuted(
        bytes32[] authorizers,
        address recipient,
        uint256 value,
        bytes callData,
        bytes authorizationData) pure external {
    }

    /////////////////////////
    // Private Functions
    ////////////////////////

    // InitializationData should be in the following format
    // uint256 numberOfAddresses
    // address address[0]
    // ...
    // address address[numberOfAddress - 1]
    function extractAddresses (bytes initializationData) pure internal returns (address[] list){
        uint256 numberOfElements;

        assembly {
            numberOfElements := mload(add(initializationData, 32)) // first 32 bytes are data padding
        }

        address[] memory addressList = new address[](numberOfElements);
        for (uint256 i = 0; i < numberOfElements; i++) {
            address tempAddress;
            assembly {
                tempAddress := mload(add(initializationData, add(32, mul(i, 20))))
            }
            addressList[i] = tempAddress;
        }
        return list;
    }
}
