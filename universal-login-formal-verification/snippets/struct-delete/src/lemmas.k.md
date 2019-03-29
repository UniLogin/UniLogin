Useful lemmas
```k

syntax Int ::= "mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000" [function]

rule mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 =>
    115792089237316195423570985007226406215939081747436879206741300988257197096960 

syntax Int ::= "IrrelevantForAddressBits" "(" Int ")" [function] 

rule IrrelevantForAddressBits(A) =>
    mask_ffff_ffff_ffff_ffff_ffff_ffff_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000 &Int A

```

### hashed storage

```k
// hashed storage offsets never overflow (probabilistic assumption):
rule chop(keccakIntList(L))        => keccakIntList(L)
rule chop(keccakIntList(L) +Int N) => keccakIntList(L) +Int N
  requires N <=Int 100
```
