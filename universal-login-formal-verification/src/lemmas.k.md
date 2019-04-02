Useful macros

```k

syntax Int ::= "mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000" [function]

syntax Int ::= "mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff" [function]


rule mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 =>
    115792089237316195423570985007226406215939081747436879206741300988257197096960 

rule mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff =>
    1461501637330902918203684832716283019655932542975


syntax Int ::= "AddressRestMask" "(" Int ")" [function] 

syntax Int ::= "AddressMask" "(" Int ")" [function] 


rule AddressRestMask(A) =>
    mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 &Int A

rule AddressMask(A) =>
    mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff &Int A


syntax Int ::= "#managementKey" [function]

rule #managementKey => 1


syntax Int ::= "asAddress" "(" Int "," Int ")" [function]

rule asAddress(A, B) => A |Int AddressRestMask(B) 


// obvious rules, needed for the proofs:

// Bit "or" newer exceeds the range of uint
rule chop(X |Int Y) => X |Int Y

//alternation of adding
rule N +Int keccakIntList(C) => keccakIntList(C) +Int N
    requires 0 <=Int N andBool N <=Int 20


// hashed storage offsets never overflow (probabilistic assumption):

rule chop(keccakIntList(L))        => keccakIntList(L)
rule chop(keccakIntList(L) +Int N) => keccakIntList(L) +Int N
requires N <=Int 100

```
