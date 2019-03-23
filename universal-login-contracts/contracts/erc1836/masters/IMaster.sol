pragma solidity ^0.5.0;


// Modified ERC1836 ** Minimal interface without upgradability
interface IMaster {
    function master() external view returns (address);
    function masterId() external pure returns (bytes32);
    // params may vary -- must be initialization
    // function initialize(...) external initialization;
}
