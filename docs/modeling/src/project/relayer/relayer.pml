@startuml

title Relayer

package UserInterface {
  class Authorisation {
    post('/')
    get('/:walletContractAddress')
    post('/:walletContractAddress')
  }

  class Config {
    get('/')
  }

  class Wallet {
    post('/')
    post('/execution')
    get('/execution/:messageHash')
    post('/deploy')
  }
}

package Core {
  class Configuration {
  }

  class QueueItem {
    transactionHash?: string;
    error?: string;
  }
}

package Domain {
  class MessageHandler {
    handleMessage(message: SignedMessage)
  }

  class WalletService {
    create(key, ensName)
    deploy(key, ensName)
  }

  class ENSService {
    findRegistrar(domain)
    argsFor(ensName)
  }

  package Messages {
    class PendingMessages {
      isPresent(messageHash)
      add(message)
      onReadyToExecute(messageHash, message)
      addSignatureToPendingMessage()
      messageHash: string, message)
      addSignatureToPendingMessage(messageHash, message)
      getStatus(messageHash)
      get(messageHash)
      remove(messageHash)
    }

    class MessageQueueService {
      add(signedMessage)
      execute(signedMessage, messageHash)
      start()
      stop()
      stopLater()
      isStopped()
      getStatus(messageHash)
    }
  }
}

package Integration {
  package MessagesStore {
    class PendingMessagesSQLStore {
      add(messageHash, pendingMessage)
      get(messageHash)
      addSignature(messageHash, signature)
      getStatus(messageHash, wallet)
      getCollectedSignatureKeyPairs(messageHash)
      setTransactionHash(messageHash, transactionHash)
      containSignature(messageHash, signature)
    }

    class QueueStore {
      add(signedMessage)
      getNext()
      markAsSuccess(messageHash, transactionHash)
      markAsError(messageHash, error)
      get(messageHash)
      getStatus(messageHash)
    }
  }

  class AuthorisationService {
    addRequest(request);
    getPendingAuthorisations(wallet);
    removeRequest(removeRequest)
  }

  class MessageExecutor {
    executeAndWait(signedMessage: SignedMessage)
  }
}


MessageHandler --> MessageExecutor
MessageHandler --> PendingMessages
MessageHandler --> MessageQueueService

PendingMessages --> PendingMessagesSQLStore
MessageQueueService --> QueueStore

Authorisation --> AuthorisationService

Wallet --> WalletService

@enduml
