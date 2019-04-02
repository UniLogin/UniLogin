High-level specification of KeyHolder
=====================================

-   `removeKey`, case 1:

```act
behaviour removeKey-1 of KeyHolder
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

iff

    (CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID)
    PrevPurpose == _purpose
    VCallValue == 0

if

    #rangeUInt(256, X - 1)
    _key =/= CALLER_ID

returns 1

```

-   `removeKey`, case 2:

```act
behaviour removeKey-2 of KeyHolder
interface removeKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
    CallerKeyPurpose : uint256
    X : uint256

storage

        #mapping.keys[_key]  |-> CallerKeyPurpose => 0
     #mapping.keys[_key] + 1 |-> PrevKey => asAddress(0, PrevKey)
                  #keyCount  |-> X => X - 1

iff

    (CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID)
    CallerKeyPurpose == _purpose
    VCallValue == 0

if

    #rangeUInt(256, X - 1)
    _key == CALLER_ID

returns 1

```

-   `addKey`, case 1:

```act
behaviour addKey-1 of KeyHolder
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

iff

    VCallValue == 0
    _key =/= AddressMask(PrevKey)
    (Z == #managementKey  or  CALLER_ID == ACCT_ID)

if

    #rangeUInt(256, Y + 1)
    _key =/= CALLER_ID

returns 1

```

-   `addKey`, case 2:

```act
behaviour addKey-2 of KeyHolder
interface addKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
          Y : uint256
          Z : uint256

storage

        #mapping.keys[_key]  |-> Z => _purpose
    #mapping.keys[_key] + 1  |-> PrevKey => asAddress(_key, PrevKey)
                  #keyCount  |-> Y => Y + 1

iff

    VCallValue == 0
    _key =/= AddressMask(PrevKey)
    (Z == #managementKey  or  CALLER_ID == ACCT_ID)

if

    #rangeUInt(256, Y + 1)
    _key == CALLER_ID

returns 1

```


-   The function `keyHasPurpose` returns `TRUE` when `#mapping.keys[_key] == _purpose`:

```act
behaviour keyHasPurpose-succ of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

storage

    #mapping.keys[_key]   |-> _purpose

iff

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

iff

    VCallValue == 0

if

    X =/= _purpose

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

iff

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

iff

    VCallValue == 0

if

    X =/= 0
    
returns 1

```

-   `keyExist`, failure case:

```act
behaviour keyExist-fail of KeyHolder
interface keyExist(address _key)

storage

    #mapping.keys[_key] + 1  |-> 0

iff

    VCallValue == 0
    
returns 0

```