Formal Verification for Universal Login
=======================================

Our goal is to formally verify functions declared in ethereum smart contracts used in our project. Currently we are in the very early stage:

-   Only a limited subset of functions is verified.
-   'Formal verification' is a pretty ambiguous idea. In this project, we are verifying that our functions are consistent with behaviors written in a language ACT, developed by [Dapphub/KLAB](https://github.com/dapphub/klab). The semantics of ACT refers to low-level primitives of EVM, i.e storage. To actually understand the given specifications knowledge of these is required. The ACT is built on the top od KEVM - semantics of EVM written in language K, developed at the University of Illinois by a research group under the supervision of professor Grigore Rosu.

Dependencies
------------

We assume that `klab` is already installed in the environment. If not, please follow these [instructions](https://github.com/dapphub/klab#installing).

Specification
-------------

The specification (statements that we want to verify) written in ACT is located at `src/spec.md`.

Running proofs
--------------

To run the proofs, use `yarn`:

-   `yarn build`: builds K specifications; before this step, the folder universal-login-contracts must be built;
-   `yarn test`: runs all proofs, one after another;
-   `yarn clean`: cleans everything.

License
-------

Details: TODO, i.e we are highly inspired by examples from [Dapphub/KLAB](https://github.com/dapphub/klab).
