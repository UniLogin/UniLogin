
@startuml

object Message {
  messageHash: string(66) primaryKey
  transactionHash: string(66)
  error: text
  gasToken: string
  operationType: number
  to: string
  from: string
  nonce: string
  gasLimit: BigNumberish
  gasPrice: BigNumberish
  data: Arrayish
  value: BigNumberish
  signature: string
}

object MessageAgregate {
  messageHash: string
  state: enum
  error: string
  collectedSignature: string[]
  transactionHash: string
}

object MessageSignatures {
  required: number
  collected[]: string[]
  total: number
}


object Transaction {
  hash: string primaryKey
  to: string
  from: string
  nonce: number | string
  gasLimit: BigNumberish
  gasPrice: BigNumberish
  data: Arrayish
  value: BigNumberish
}

object Deployment {
  deployHash: string primaryKey
  publicKey: string(..)
  ensName: string
  gasLimit: BigNumberish
  gasPrice: BigNumberish
  )
}

object DeployAgregate {
  deployHash: string
  error: string
  transactionHash: string
}


Message ---* MessageAgregate
MessageAgregate *-- Transaction
MessageSignatures --* MessageAgregate
Deployment --* DeployAgregate 
DeployAgregate *-- Transaction 

@enduml