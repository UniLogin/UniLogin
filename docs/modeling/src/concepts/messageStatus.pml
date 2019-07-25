@startuml

class MessageStatus {
  collectedSignatures: string[]
  totalCollected: number
  required: number

  messageHash: string
  state: MessageState

  transactionHash?: string
  error?: string
}

@enduml