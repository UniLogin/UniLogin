
SHELL = /bin/bash
SRC_SPEC = src/spec.md
SRC_JSON = dapp/out/KeyHolder.sol.json
SOLC = ethereum/solc:0.5.2

SRC_SOL:= ../universal-login-contracts/contracts/KeyHolder/KeyHolder.sol \
		  ../universal-login-contracts/contracts/KeyHolder/IKeyHolder.sol 

INVOKE_TESTS := do \
					klab prove $$f > out.txt; \
					cat out.txt; \
					cat out.txt | grep "ACCEPT"; \
					if [ $$? -ne 0 ]; then exit 1; fi; \
				done;

MAIN_SOL = KeyHolder.sol

proof: build
	for f in out/specs/*; \
	$(INVOKE_TESTS)

proof-1: build
	for f in out/specs/KeyHolder_addKey*; \
	$(INVOKE_TESTS)

proof-2: build
	for f in out/specs/KeyHolder_removeKey*; \
	$(INVOKE_TESTS)

proof-3: build
	for f in out/specs/KeyHolder_key*; \
	$(INVOKE_TESTS)

proof-4: build
	for f in out/specs/KeyHolder_get*; \
	$(INVOKE_TESTS)

build: $(SRC_JSON) $(SRC_SPEC)
	klab build

$(SRC_JSON): $(SRC_SOL)
	mkdir -p dapp/src
	mkdir -p dapp/out
	cp $(SRC_SOL) dapp/src
	docker create -v /src --name comp $(SOLC) 
	docker cp dapp/src/KeyHolder.sol comp:/src
	docker cp dapp/src/IKeyHolder.sol comp:/src
	docker run --volumes-from comp $(SOLC) \
	--combined-json=abi,bin,bin-runtime,srcmap,srcmap-runtime,ast \
	/src/$(MAIN_SOL) > $(SRC_JSON)

clean:
	rm -rf out dapp
	docker rm comp
