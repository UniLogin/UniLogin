High-level specification of KeyHolder
=====================================

-  Semantics of the function `removeKey`, case when `_key =/= CALLER_ID`:

```act
behaviour removeKey-1 of KeyHolder
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

    VCallValue == 0
    PrevPurpose == _purpose
    CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID

if

    #rangeUInt(256, X - 1)
    _key =/= CALLER_ID

returns 1

```

-  Semantics of the function `removeKey`, case when `_key == CALLER_ID`:

```act
behaviour removeKey-2 of KeyHolder
interface removeKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
    CallerKeyPurpose : uint256
    X : uint256

storage

    #mapping.keys[_key].purpose  |-> CallerKeyPurpose => 0
    #mapping.keys[_key].key      |-> PrevKey => asAddress(0, PrevKey)
                      #keyCount  |-> X => X - 1

iff

    VCallValue == 0
    CallerKeyPurpose == _purpose
    CallerKeyPurpose == #managementKey  or  CALLER_ID == ACCT_ID

if

    #rangeUInt(256, X - 1)
    _key == CALLER_ID

returns 1

```

-  Semantics of the function `addKey`, case when `_key =/= CALLER_ID`:

```act
behaviour addKey-1 of KeyHolder
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
    Z == #managementKey  or  CALLER_ID == ACCT_ID

if

    #rangeUInt(256, Y + 1)
    _key =/= CALLER_ID

returns 1

```

-  Semantics of the function `addKey`, case when `_key == CALLER_ID`:

```act
behaviour addKey-2 of KeyHolder
interface addKey(address _key, uint256 _purpose)

types

    PrevKey : uint256
          Y : uint256
          Z : uint256

storage

    #mapping.keys[_key].purpose  |-> Z => _purpose
    #mapping.keys[_key].key      |-> PrevKey => asAddress(_key, PrevKey)
                      #keyCount  |-> Y => Y + 1

iff

    VCallValue == 0
    _key =/= AddressMask(PrevKey)
    Z == #managementKey  or  CALLER_ID == ACCT_ID

if

    #rangeUInt(256, Y + 1)
    _key == CALLER_ID

returns 1

```

-  Semantics of the function `keyHasPurpose`, case when `true` is returned:

```act
behaviour keyHasPurpose-succ of KeyHolder
interface keyHasPurpose(address _key, uint256 _purpose)

storage

    #mapping.keys[_key].purpose   |-> _purpose

iff

    VCallValue == 0

returns 1

```

-  Semantics of the function `keyHasPurpose`, case when `false` is returned:

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

-  Semantics of the function `getKeyPurpose`:

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

-  Semantics of the function `keyExist`, case when `true` is returned:

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

-  Semantics of the function `keyExist`, case when `false` is returned:

```act
behaviour keyExist-fail of KeyHolder
interface keyExist(address _key)

storage

    #mapping.keys[_key].key  |-> 0

iff

    VCallValue == 0
    
returns 0

```
