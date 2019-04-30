
SHELL = /bin/bash
SRC_SPEC = src/spec.md
SRC_JSON = dapp/out/KeyHolder.sol.json
LOG_FILE = out.log

INVOKE_TESTS := do \
					klab prove $$f > $(LOG_FILE); \
					cat $(LOG_FILE); \
					cat $(LOG_FILE) | grep "ACCEPT"; \
					if [ $$? -ne 0 ]; then exit 1; fi; \
				done;

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

build: 
	cd .. && yarn install
	cd .. && yarn build
	mkdir -p dapp/out
	cp ../universal-login-contracts/build/Combined-Json.json $(SRC_JSON)
	cp -r ../universal-login-contracts/contracts dapp/contracts
	cp -r ../node_modules/openzeppelin-solidity dapp/openzeppelin-solidity
	cp -r ../node_modules/@ensdomains dapp/@ensdomains
	klab build

clean:
	rm -rf out dapp $(LOG_FILE)
