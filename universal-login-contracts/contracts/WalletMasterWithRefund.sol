pragma solidity ^0.5.2;

import "./WalletMaster.sol";


/* solium-disable no-empty-blocks */
contract WalletMasterWithRefund is WalletMaster {
    function getDeploymentGasUsed() private pure returns(uint) {
        return 500000;
    }

    // Disabled upgradability: persistent nonce not sync
    function initializeWithRefund(
        address _key,
        bytes32 _hashLabel,
        string calldata _name,
        bytes32 _node,
        ENS ens,
        FIFSRegistrar registrar,
        PublicResolver resolver,
        address payable relayer,
        uint gasPrice,
        bytes calldata signature) external onlyInitializing()
    {
        require(signature.length == 65, "Invalid signature");
        require(_key == getSigner(_hashLabel, _name, _node, gasPrice, signature), "Invalid signature");
        this.initializeWithENS(_key, _hashLabel, _name, _node, ens, registrar, resolver);
        refund(getDeploymentGasUsed(), gasPrice, address(0), relayer);
    }

    function getSigner(
        bytes32 _hashLabel,
        string memory _name,
        bytes32 _node,
        uint gasPrice,
        bytes memory signature) public pure returns (address)
    {
        return calculateInitializeHash(_hashLabel, _name, _node, gasPrice).toEthSignedMessageHash().recover(signature);
    }

    function calculateInitializeHash(
        bytes32 _hashLabel,
        string memory _name,
        bytes32 _node,
        uint gasPrice) public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(_hashLabel, _name, _node, gasPrice));
    }
}
