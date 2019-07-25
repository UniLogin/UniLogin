@startuml

class MessageStatus {
  required: number
  collectedSignatures: string[]
  totalCollected: number

  messageHash: string
  state: MessageState

  transactionHash?: string
  error?: string
}

@enduml