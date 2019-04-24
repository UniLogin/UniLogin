pragma solidity ^0.5.2;


contract IKeyHolder {
    uint256 constant public MANAGEMENT_KEY = 1;
    uint256 constant public ACTION_KEY = 2;

    event KeyAdded(address indexed key, uint256 indexed purpose);
    event KeyRemoved(address indexed key, uint256 indexed purpose);

    struct Key {
        uint256 purpose;
        address key;
    }

    function getKeyPurpose(address _key) public view returns(uint256 purpose);
    function addKey(address _key, uint256 _purpose) public returns (bool success);
}
