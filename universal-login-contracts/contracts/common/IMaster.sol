pragma solidity ^0.5.0;


interface IMaster {
	function UUID        ()                       external pure returns (bytes32);
	function master      ()                       external view returns (address);
	function getData     (bytes32)                external view returns (bytes32);
	function setData     (bytes32,bytes32)        external;
	function updateMaster(address,bytes calldata) external; /*protected*/
	// params may vary -- must be initialization
	// function initialize(...) external initialization;
}
