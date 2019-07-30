pragma solidity ^0.5.0;

import "../interfaces/IERC897.sol";


contract IMaster is IERC897 {
    function controller()
        external view returns (address);

    function updateImplementation(address logic, bytes calldata data, bool reset)
        external;
}
