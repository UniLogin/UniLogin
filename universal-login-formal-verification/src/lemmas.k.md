Useful macros

```k

syntax Int ::= "mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000" [function]

syntax Int ::= "mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff" [function]


rule mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 =>
    115792089237316195423570985007226406215939081747436879206741300988257197096960 

rule mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff =>
    1461501637330902918203684832716283019655932542975


syntax Int ::= "IrrelevantForAddressBits" "(" Int ")" [function] 

syntax Int ::= "RelevantForAddressBits" "(" Int ")" [function] 


rule IrrelevantForAddressBits(A) =>
    mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 &Int A

rule RelevantForAddressBits(A) =>
    mask_0000_0000_0000_0000_0000_0000_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff_ffff &Int A


syntax Int ::= "#managementKey" [function]

rule #managementKey => 1

```
