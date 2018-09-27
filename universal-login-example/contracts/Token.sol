pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Token is StandardToken {
    string public constant name = "UniversalLoginToken";
    string public constant symbol = "UNL";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }

    function drip(address _serviceContract) public {
        totalSupply_ += 20;
        balances[msg.sender] += 20;
        approve(_serviceContract, 20);
    }
}