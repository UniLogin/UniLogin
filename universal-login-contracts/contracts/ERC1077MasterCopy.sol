pragma solidity ^0.5.2;

import "./common/MasterCopy.sol";
import "./ERC1077.sol";


contract ERC1077MasterCopy is MasterCopy, ERC1077 {
    constructor(address _key) ERC1077(_key) public {
    }
}