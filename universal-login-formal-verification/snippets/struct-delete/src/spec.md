
```act
behaviour test of Snippet
interface test(address u, uint256 v)

types

    W : uint256
    X : uint256
    Y : uint256

storage

    #mapping.keys[u].a |-> W => 0
    #mapping.keys[u].b |-> X => 0 |Int IrrelevantForAddressBits(X)

if

    VCallValue == 0
    #rangeUInt(256, 0 |Int IrrelevantForAddressBits(X))

returns 1
```

