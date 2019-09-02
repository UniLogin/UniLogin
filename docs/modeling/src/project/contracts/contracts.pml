@startuml

title Contracts

package OpenZeppelin {
  class Ownable {
    transferOwnership()
    onlyOwner();
  }

  class Proxy {
    function()
  }

  class BaseUpgradeabilityProxy {
    _implementation()
    _upgradeTo(newImplementation)
    _setImplementation
  }

  class Initializable {
    initializer()
  }

  class Address {
    isContract(address)
  }
}

package Utils {
  class ENSUtils {
    registerENS(...)
  }

  class ERC1271Utils {
    getMagicValue()
    getInvalidSignature()
  }

  class StringUtils {
    uintToString()
  }
}

package Interfaces {
  interface IERC1271 {
    isValidSignature(bytes32, bytes memory) : bool
  }

  interface Authorisable {
    onlyAuhtorised()
  }
}

package Wallet {
  class WalletProxyFactory {
    constructor(WalletProxyCode)
    createContract(salt, initCode) onlyOwner
    registerDomain(node);
  }

  class WalletProxy {
    constructor(address _master)
  }

  class KeyHolder {
    {abstract} keyExist(key)
    addKey(key)
    removeKey(key)
    onlyAuhtorised()
  }

  class Executor {
    {abstract} keyExist()
    {abstract} requiredSignatures();
    executeSigned(...)
    refundGas()
    calculateMessageHash()
    areSignaturesValid()
  }

  class Wallet {
    initialize(address publicKey);
    initializeWithENS(address publicKey, ENSDomain);
    setRequiredSignatures()
    onlyAuhtorised()
    isValidSignature(data, signature)
    onERC721Received(...)
  }

}

StringUtils <|-- Wallet
Executor <|-- Wallet
ERC1271Utils <|-- Wallet
ENSUtils <|-- Wallet
KeyHolder <|-- Wallet
Authorisable <|-- KeyHolder
Ownable <|-- WalletProxyFactory
Proxy <|-- BaseUpgradeabilityProxy
Initializable <|-- Wallet
BaseUpgradeabilityProxy <|-- WalletProxy

@enduml