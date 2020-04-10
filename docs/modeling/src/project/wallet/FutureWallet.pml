@startuml
class FutureWallet {
  ensName: string
  gasPrice: BigNumber
  futureContractAddress: FutureContractAddress
}

interface FutureContractAddress {
  DAI: address // or 0x1..c: address
  ETH: address // or 0x0..0: address
}

@enduml