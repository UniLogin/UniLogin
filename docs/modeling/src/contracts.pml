@startuml

title Contracts

class ENSDomain {
  bytes32 _hashLabel
  string calldata _name
  bytes32 _node
  ENS ens*
  FIFSRegistrar registrar*
  PublicResolver resolver*
}

class IMaster {
  master()
  masterId()
}

class MasterBase {
  master()
  masterId()
}

class Ownable {

}

class IERC1271 {
  isValidSignature(bytes32, bytes memory) : bool
}


class Factory {
  registrars[]*
  resolvers[]*
  ENS*
  constructor(proxyCode)
  createContract(salt, initCode) onlyOwner
  registerDomain(node);
}

class Proxy {
  constructor(address _master, bytes memory _initData)
}

class WalletMaster {
  initializeWithENS(address publicKey, ENSDomain)
  initialize(address publicKey)
}

class Store {
  address masterAddress;
  bool initialized;
}

class Core {
  onlyInitializing()
  setMaster(_newMaster, _initData)
}

Proxy *-- WalletMaster
Ownable <|-- Factory
IMaster <|-- MasterBase
IERC1271 <|-- WalletMaster
Store <|-- Core
MasterBase <|-- WalletMaster
Core <|-- MasterBase
Core <|-- Proxy

@enduml