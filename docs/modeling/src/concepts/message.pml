@startuml

class Message {
  to: address
  from: address
  value: uint
  data: bytes

  gasToken: address
  gasLimit: uint
  gasPrice: uint

  nonce: uint
  signature: bytes
}

@enduml