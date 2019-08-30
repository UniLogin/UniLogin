@startuml

title Contracts

interface IMaster {
  master()
  masterId()
}


interface IERC1271 {
  isValidSignature(bytes32, bytes memory) : bool
}

interface IAutorisable {
  isAuthorised()
}

class MasterBase {
  master()
  masterId()
  updateImplementation(newMasterAddress, updateData, reset) onlyAuthorized();
}

class Ownable {
  transferOwnership()
  onlyOwner();
}

class WalletProxyFactory {
  constructor(proxyCode)
  createContract(salt, initCode) onlyOwner
  registerDomain(node);
}

class Proxy {
  constructor(address _master, bytes memory _initData)
}

class KeyHolder {
  addKey(key, purpose)
  removeKey(key, purpose)
  keyExist(key)
}

class ERC1077 {
  executeSigned(...)
  isAuthorised()
  setRequiredSignatures()
  refundGas()
  calculateMessageHash()
}

class WalletMaster {
  initializeWithENS(address publicKey, ENSDomain);
  initialize(address publicKey);
}
class Store {
  address masterAddress;
  bool initialized;
}

class Core {
  onlyInitializing()
  setMaster(_newMaster, _initData)
}

class ENSRegistered {
  registerENS(...)
}

IAutorisable <|-- KeyHolder
KeyHolder <|-- ERC1077
IAutorisable <|-- MasterBase
ERC1077 <|-- WalletMaster
IERC1271 <|-- WalletMaster
ENSRegistered <|-- WalletMaster
Proxy *-- WalletMaster
Ownable <|-- WalletProxyFactory
IMaster <|-- MasterBase
Store <|-- Core
MasterBase <|-- WalletMaster
Core <|-- MasterBase
Core <|-- Proxy

@enduml