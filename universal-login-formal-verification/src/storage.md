Storage locations
```k

syntax Int ::= "#mapping.keys" "[" Int "].purpose" [function]

syntax Int ::= "#mapping.keys" "[" Int "].key" [function]

syntax Int ::= "#keyCount" [function]


rule #mapping.keys[A].purpose => #hashedLocation("Solidity", 0, A)

rule #mapping.keys[A].key => #hashedLocation("Solidity", 0, A) +Int 1

rule #keyCount => 1

```
