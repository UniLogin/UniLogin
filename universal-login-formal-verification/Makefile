
SHELL = /bin/bash
SRC_SPEC = src/spec.md
SRC_JSON = dapp/out/KeyHolder.sol.json
SOLC = ethereum/solc:0.5.2

SRC_SOL:= ../universal-login-contracts/contracts/KeyHolder.sol \
		  ../universal-login-contracts/contracts/IKeyHolder.sol

MAIN_SOL = KeyHolder.sol

proof: build
	ls out/specs
	export TERM=xterm
	for f in out/specs/*; do klab prove $$f; done; 

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
