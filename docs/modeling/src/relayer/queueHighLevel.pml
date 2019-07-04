
@startuml

package Common-Core {
  class Message {
    operationType: number
    to: string
    from: string
    nonce: string
    gasLimit: BigNumberish
    gasPrice: BigNumberish
    gasToken: string
    data: Arrayish
    value: BigNumberish
    signature: string
  }

  class Deployment {
    publicKey: string 
    gasLimit: BigNumberish
    gasPrice: BigNumberish
    ensName: string
    ...
    signature: string
  }


  class Transaction {
    hash: string primaryKey
    to: string
    from: string
    nonce: number | string
    gasLimit: BigNumberish
    gasPrice: BigNumberish
    data: Arrayish
    value: BigNumberish
  }

  enum QueuedItemState {
    Queued  
    Pending
    Error
    Success
  }

  enum MessageState {
    AwaitSignature
  }

  enum DeployState {
  }

  class MessageSignatureStatus {    
    signatures: []
    required: number
    collected: number
  }

  class MessageStatus {
    message: Message
    state: MessageState
    error: string
    transactionHash: string
    signatures: MessageSignatureStatus
  }
}

package Relayer-Core {
  package Queue {
    enum QueueItemType {
      Message,
      Queue
    }

    class QueueItem {
      type: QueueItemType
      createdAt: TimeStamp
      transactionHash: string    
      hash: string
      state: number
      error: string
    }

    class MessageItem {
      state: MessageState
      collectedSignature: string[]
    }

    class DeployItem {
      state: DeploymentState    
    }
  }

  class MessageSignaturesService {
    getCollectedSignatures(message)
    getCollectedSignaturesCount(message)
    getRequiredSignatures(message)
  }

  class MessageStatusService {
    getStatus(messageHash)
  }

  class Queue {
    loop()
  }
}

package Integration {
  class MessageSignaturesService {
    getRequiredSignatures(messageHash)
  }

  class MessageRepository {
    getMessage(messageHash)
  }

  class QueueRepository {
    getNext()
  }
}

Message ---* MessageItem
MessageItem *-- Transaction
Deployment --* DeployItem 
DeployItem *-- Transaction 

QueueItem <-- MessageItem
QueueItem <-- DeployItem

QueuedItemState <-- MessageState

QueuedItemState <-- DeployState

@enduml