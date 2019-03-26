pragma solidity ^0.5.0;


interface IERC725
{
	event DataChanged(bytes32 indexed key, bytes32 indexed value);
	event ContractCreated(address indexed contractAddress);

	function owner  ()                external view returns (address);
	function getData(bytes32)         external view returns (bytes32);
	function setData(bytes32,bytes32) external;
	// function execute(uint256,address,uint256,bytes calldata) external;
}
