pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/* solium-disable uppercase */
contract MockDai is ERC20 {
    bytes32 public constant name = 0x44616920537461626c65636f696e2076312e3000000000000000000000000000;
    bytes32 public constant symbol = 0x4441490000000000000000000000000000000000000000000000000000000000;
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
