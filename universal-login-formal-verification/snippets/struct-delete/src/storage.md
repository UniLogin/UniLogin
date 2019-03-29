Storage locations
```k
syntax Int ::= "#mapping.keys" "[" Int "].a" [function]
rule #mapping.keys[A].a => #hashedLocation("Solidity", 0, A) +Int 0

syntax Int ::= "#mapping.keys" "[" Int "].b" [function]
rule #mapping.keys[A].b => #hashedLocation("Solidity", 0, A) +Int 1
```
