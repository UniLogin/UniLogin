pragma solidity ^0.5.2;


contract IKeyHolder {
    uint256 constant MANAGEMENT_KEY = 1;
    uint256 constant ACTION_KEY = 2;
    uint256 constant CLAIM_SIGNER_KEY = 3;
    uint256 constant ENCRYPTION_KEY = 4;

    event KeyAdded(address indexed key, uint256 indexed purpose);
    event KeyRemoved(address indexed key, uint256 indexed purpose);

    struct Key {
        uint256 purpose;
        address key;
    }

    function getKeyPurpose(address _key) public view returns(uint256 purpose);
    function addKey(address _key, uint256 _purpose) public returns (bool success);
}
