pragma solidity ^0.5.2;


interface IMaster {
    function master() external view returns (address);
    function masterId() external pure returns (bytes32);
}
