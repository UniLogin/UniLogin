High-level specification of KeyHolder
=====================================

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
