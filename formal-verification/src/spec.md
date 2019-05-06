Table of Contents
=================

* [Contract ERC1077](#high-level-specification-of-the-contract-erc1077)
    * [setRequiredSignatures](#setRequiredSignatures)
* [Contract KeyHolder](#high-level-specification-of-the-contract-keyholder)
    * [removeKey](#removeKey)
    * [addKey](#addKey)
    * [keyHasPurpose](#keyHasPurpose)
    * [getKeyPurpose](#getKeyPurpose)
    * [keyExist](#keyExist)


# High-level specification of the contract ERC1077 

## setRequiredSignatures
Semantics of the function `setRequiredSignatures`: 

```act
behaviour setRequiredSignatures of ERC1077
interface setRequiredSignatures(uint _requiredSignatures)

types

    X : uint256
    Y : uint256

storage

    1 |-> Y
    3 |-> X => _requiredSignatures
    #mapping.keys[CALLER_ID].purpose |-> CallerKeyPurpose

iff

    VCallValue == 0
    X =/= _requiredSignatures
    _requiredSignatures > 0
    _requiredSignatures <= Y
    CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID

```


# High-level specification of the contract KeyHolder

##removeKey
Semantics of the function `removeKey`:

```act
behaviour removeKey of KeyHolder
interface removeKey(address _key, uint256 _purpose)

types

    PrevPurpose : uint256
    PrevKey : uint256
    CallerKeyPurpose : uint256
    X : uint256

storage

        #mapping.keys[_key].purpose  |-> PrevPurpose => 0
        #mapping.keys[_key].key      |-> PrevKey => asAddress(0, PrevKey)
                          #keyCount  |-> X => X - 1
    #mapping.keys[CALLER_ID].purpose |-> CallerKeyPurpose

iff

    _key =/= CALLER_ID
    VCallValue == 0
    PrevPurpose == _purpose
    #rangeUInt(256, X - 1)
    CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID


returns 1

```

##addKey
Semantics of the function `addKey`:

```act
behaviour addKey of KeyHolder
interface addKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
          Y : uint256
          Z : uint256

storage

        #mapping.keys[_key].purpose  |-> _ => _purpose
        #mapping.keys[_key].key      |-> PrevKey => asAddress(_key, PrevKey)
                          #keyCount  |-> Y => Y + 1
    #mapping.keys[CALLER_ID].purpose |-> Z

iff

    VCallValue == 0
    _key =/= AddressMask(PrevKey)
    #rangeUInt(256, Y + 1)
    _key =/= CALLER_ID
    Z == #managementKey  or  CALLER_ID == ACCT_ID

returns 1

```

##keyHasPurpose
Semantics of the function `keyHasPurpose`, case when `true` is returned:

```act
behaviour keyHasPurpose-succ of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

storage

    #mapping.keys[_key].purpose   |-> _purpose

iff

    VCallValue == 0

returns 1

```

Semantics of the function `keyHasPurpose`, case when `false` is returned:

```act
behaviour keyHasPurpose-fail of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

types

    X : uint256

storage

    #mapping.keys[_key].purpose   |-> X

iff

    VCallValue == 0

if

    X =/= _purpose

returns 0

```

##getKeyPurpose
Semantics of the function `getKeyPurpose`:

```act
behaviour getKeyPurpose of KeyHolder
interface getKeyPurpose(address _key)

types

    X : uint256

storage

    #mapping.keys[_key].purpose  |-> X

iff

    VCallValue == 0

returns X

```

##keyExist
Semantics of the function `keyExist`, case when `true` is returned:

```act
behaviour keyExist-succ of KeyHolder
interface keyExist(address _key)

types

    X : address

storage

    #mapping.keys[_key].key  |-> X

iff

    VCallValue == 0

if

    X =/= 0
    
returns 1

```

Semantics of the function `keyExist`, case when `false` is returned:

```act
behaviour keyExist-fail of KeyHolder
interface keyExist(address _key)

storage

    #mapping.keys[_key].key  |-> 0

iff

    VCallValue == 0
    
returns 0

```
