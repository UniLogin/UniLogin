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


// hashed storage offsets never overflow (probabilistic assumption):

rule chop(keccakIntList(L))        => keccakIntList(L)
rule chop(keccakIntList(L) +Int N) => keccakIntList(L) +Int N
requires N <=Int 100

rule chop(N +Int keccakIntList(L) ) => N +Int keccakIntList(L)
requires N <=Int 100

rule A ==K B +Int keccakIntList(C) => false
     requires 0 <=Int A andBool A <=Int 20
     andBool 0 <=Int B andBool B <=Int 20
rule A =/=K B +Int keccakIntList(C) => true
     requires 0 <=Int A andBool A <=Int 20
     andBool 0 <=Int B andBool B <=Int 20

rule B +Int keccakIntList(C) ==K A => false
     requires 0 <=Int A andBool A <=Int 20
     andBool 0 <=Int B andBool B <=Int 20
rule B +Int keccakIntList(C) =/=K A => true
     requires 0 <=Int A andBool A <=Int 20
     andBool 0 <=Int B andBool B <=Int 20

rule keccakIntList(C) ==K B +Int keccakIntList(A) => false
     requires 0 <=Int B andBool B <=Int 20
rule keccakIntList(C) =/=K B +Int keccakIntList(A) => true
     requires 0 <=Int B andBool B <=Int 20

rule B +Int keccakIntList(C) ==K keccakIntList(A) => false
     requires 0 <=Int B andBool B <=Int 20
rule B +Int keccakIntList(C) =/=K keccakIntList(A) => true
     requires 0 <=Int B andBool B <=Int 20

```

