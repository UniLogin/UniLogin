pragma solidity ^0.5.0;

import "../common/Core.sol";


contract Proxy is Core {
    constructor(address _master, bytes memory _initData) public {
        setMaster(_master, _initData);
    }

    function () external payable {
        if (m_master != address(0)) {
            // solium-disable-next-line security/no-inline-assembly
            assembly {
                let to  := and(sload(0x0), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF) // m_master
                let ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize)
                let result := delegatecall(gas, to, ptr, calldatasize, 0, 0)
                let size := returndatasize
                returndatacopy(ptr, 0, size)
                switch result
                case 0  { revert (ptr, size) }
                default { return (ptr, size) }
            }
        }
    }
}
