High-level specification of KeyHolder
=====================================

-   `removeKey`:

```act
behaviour removeKey-succ of KeyHolder
interface removeKey(address _key, uint256 _purpose)

types

    W : uint256
    X : uint256
    Y : uint256
    Z : uint256

storage

        #mapping.keys[_key]  |-> W => 0
    1 + #mapping.keys[_key]  |-> X => 0 |Int IrrelevantForAddressBits(X)
                  #keyCount  |-> Y => Y - 1
    #mapping.keys[CALLER_ID] |-> Z

if

    W == _purpose
    #rangeUInt(256, Y - 1)
    (Z == #managementKey  or  CALLER_ID == ACCT_ID)

    #rangeUInt(256, #mapping.keys[CALLER_ID])
    #rangeUInt(256, 1 + #mapping.keys[_key])
    #rangeUInt(256, _key |Int IrrelevantForAddressBits(X))

    #keyCount =/= #mapping.keys[_key]
    #keyCount =/= 1 + #mapping.keys[_key]
    #mapping.keys[CALLER_ID] =/= #keyCount
    #mapping.keys[CALLER_ID] =/= #mapping.keys[_key]
    #mapping.keys[CALLER_ID] =/= 1 + #mapping.keys[_key]

    VCallValue == 0

returns 1

```


-   `addKey`:

```act
behaviour addKey-succ of KeyHolder
interface addKey(address _key, uint256 _purpose)

types

    X : uint256
    Y : uint256
    Z : uint256

storage

        #mapping.keys[_key]  |-> _ => _purpose
    1 + #mapping.keys[_key]  |-> X => _key |Int IrrelevantForAddressBits(X)
                  #keyCount  |-> Y => Y + 1
    #mapping.keys[CALLER_ID] |-> Z

if

    _key =/= RelevantForAddressBits(X)
    #rangeUInt(256, Y + 1)
    (Z == #managementKey  or  CALLER_ID == ACCT_ID)

    #rangeUInt(256, #mapping.keys[CALLER_ID])
    #rangeUInt(256, 1 + #mapping.keys[_key])
    #rangeUInt(256, _key |Int IrrelevantForAddressBits(X))

    #keyCount =/= #mapping.keys[_key]
    #keyCount =/= 1 + #mapping.keys[_key]
    #mapping.keys[CALLER_ID] =/= #keyCount
    #mapping.keys[CALLER_ID] =/= #mapping.keys[_key]
    #mapping.keys[CALLER_ID] =/= 1 + #mapping.keys[_key]

    VCallValue == 0

returns 1

```

-   The function `keyHasPurpose` returns `TRUE` when `#mapping.keys[_key] == _purpose`:

```act
behaviour keyHasPurpose-succ of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

storage

    #mapping.keys[_key]   |-> _purpose

if

    VCallValue == 0
    0 <= #mapping.keys[_key]
    #mapping.keys[_key] <  (2 ^Int 256)

returns 1

```

-   `keyHasPurpose` returns `FALSE` when `#mapping.keys[_key] =/= _purpose`:

```act
behaviour keyHasPurpose-fail of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

types

    X : uint256

storage

    #mapping.keys[_key]   |-> X

if

    X =/= _purpose
    VCallValue == 0
    0 <= #mapping.keys[_key]
    #mapping.keys[_key] <  (2 ^Int 256)

returns 0

```

-   `getKeyPurpose`:

```act
behaviour getKeyPurpose of KeyHolder
interface getKeyPurpose(address _key)

types

    X : uint256

storage

    #mapping.keys[_key]  |-> X

if

    VCallValue == 0
    0 <= #mapping.keys[_key]
    #mapping.keys[_key] <  (2 ^Int 256)

returns X

```

-   `keyExist`, success case:

```act
behaviour keyExist-succ of KeyHolder
interface keyExist(address _key)

types

    X : address

storage

    1 + #mapping.keys[_key]  |-> X

if

    X =/= 0
    VCallValue == 0
    0 <= 1 + #mapping.keys[_key]
    1 + #mapping.keys[_key] <  (2 ^Int 256)

returns 1

```

