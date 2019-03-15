Storage locations
```k

syntax Int ::= "#mapping.keys" "[" Int "]" [function]

syntax Int ::= "#keyCount" [function]


rule #mapping.keys[A] => #hashedLocation("Solidity", 0, A)

rule #keyCount => 1

```
