

```act
behaviour test of Snippet
interface test(address u, uint256 v)

types

    W : uint256
    X : uint256
    Y : uint256

storage

     #mapping.keys[u]     |-> W => 0
     1 + #mapping.keys[u] |-> X => 0 |Int IrrelevantForAddressBits(X)

if

    VCallValue == 0
    #rangeUInt(256, 0 |Int IrrelevantForAddressBits(X))
    #rangeUInt(256, 1 + #mapping.keys[u])
    #rangeUInt(256, #mapping.keys[u])

returns 1

```

