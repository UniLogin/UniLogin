@startuml

object Deploy {
  deployHash: varchar primaryKey
  transactionHash: varchar(66)
  error: text
  publicKey: varchar(..)
  ensName: varchar
  ???from transaction (
  *gasLimit: varchar (utils.BigNumberish)
  *gasPrice: varchar (utils.BigNumberish)
  )
}

object Message {
  messageHash: varchar(66) primaryKey
  transactionHash: varchar(66)
  error: text
  gasToken: varchar
  operationType: number
  ???from transaction (
  *to: varchar
  *from: varchar
  *nonce: varchar
  *gasLimit: varchar (utils.BigNumberish)
  *gasPrice: varchar (utils.BigNumberish)
  *data: utils.Arrayish
  *value: varchar (utils.BigNumberish)
  )
  signature: varchar
}

object QueueItem {
  messageHash: varchar(66) foreignKey
  deployHash: varchar foreignKey
  created_at: timestamp
}

object QueueItem2 {
  hash: varchar(66) foreignKey
  contex: 'DEPLOY' | 'MESSAGE'
  created_at: timestamp
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

object MessageStatus {
  messageHash?: string,
  error?: string,
  collectedSignatures: string[],
  totalCollected: number,
  required: number,
  transactionHash: string | null
}

Deploy "1" -- "1..0" Transaction: (transactionHash:hash)
Message "1" -- "1..0" Transaction: (transactionHash:hash)
Deploy "1..0" -- "1..0" QueueItem: (deployHash)
Message "1..0" -- "1..0" QueueItem: (messageHash)



@enduml