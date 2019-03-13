Storage locations
```k

syntax Int ::= "#mapping.keys" "[" Int "]" [function]

rule #mapping.keys[A] => #hashedLocation("Solidity", 0, A)

```
