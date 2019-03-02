pragma solidity ^0.5.2;


contract IKeyHolder {
    uint256 constant MANAGEMENT_KEY = 1;
    uint256 constant ACTION_KEY = 2;
    uint256 constant CLAIM_SIGNER_KEY = 3;
    uint256 constant ENCRYPTION_KEY = 4;

    event KeyAdded(bytes32 indexed key, uint256 indexed purpose);
    event KeyRemoved(bytes32 indexed key, uint256 indexed purpose);

    struct Key {
        uint256 purpose;
        bytes32 key;
    }

    function getKey(bytes32 _key) public view returns(uint256 purpose, bytes32 key);
    function getKeyPurpose(bytes32 _key) public view returns(uint256 purpose);
    function getKeysByPurpose(uint256 _purpose) public view returns(bytes32[] memory keys);
    function addKey(bytes32 _key, uint256 _purpose) public returns (bool success);
}
