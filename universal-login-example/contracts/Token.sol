pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20 {
    string public constant name = "UniversalLoginToken";
    string public constant symbol = "UNL";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 10000000 * (10 ** uint256(decimals));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
