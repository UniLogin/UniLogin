High-level specification of KeyHolder
=====================================

-   `removeKey`:

```act
behaviour removeKey-succ of KeyHolder
interface removeKey(address _key, uint256 _purpose)

types

    PrevPurpose : uint256
    PrevKey : uint256
    CallerKeyPurpose : uint256
    X : uint256

storage

        #mapping.keys[_key]  |-> PrevPurpose => 0
     #mapping.keys[_key] + 1 |-> PrevKey => asAddress(0, PrevKey)
                  #keyCount  |-> X => X - 1
    #mapping.keys[CALLER_ID] |-> CallerKeyPurpose

if

    (CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID)
    PrevPurpose == _purpose
    #rangeUInt(256, X - 1)

    _key =/= CALLER_ID
    VCallValue == 0

returns 1

```

-   `addKey`:

```act
behaviour addKey-succ of KeyHolder
interface addKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
          Y : uint256
          Z : uint256

storage

        #mapping.keys[_key]  |-> _ => _purpose
    #mapping.keys[_key] + 1  |-> PrevKey => asAddress(_key, PrevKey)
                  #keyCount  |-> Y => Y + 1
    #mapping.keys[CALLER_ID] |-> Z

if

    _key =/= AddressMask(PrevKey)
    #rangeUInt(256, Y + 1)
    (Z == #managementKey  or  CALLER_ID == ACCT_ID)

    _key =/= CALLER_ID
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

returns X

```

-   `keyExist`, success case:

```act
behaviour keyExist-succ of KeyHolder
interface keyExist(address _key)

types

    X : address

storage

    #mapping.keys[_key] + 1  |-> X

if

    X =/= 0
    VCallValue == 0

returns 1

```

