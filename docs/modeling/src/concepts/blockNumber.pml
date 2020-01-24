@startuml

title BlockNumber

package concept1 {
  class BlockNumberState {
    bindedSet(value)
    set(value)
    get()
    firsSubscribe()
    lastSubscribe()
  }

  class BlockChainService {
    on(event, callback)
    removeEventListener(event, callback)
    getBlockChainNumber()
  }

  class BlockNumberStorage {
    get()
    set(value)
    remove(value)
  }

  class BlockNumberService {
    subscribe(callback)
    get()
    set()
    async sync()
  }

  BlockNumberService *-- BlockNumberState
  BlockNumberService *-- BlockNumberStorage
  BlockNumberService *-- BlockChainService
  BlockNumberState *-- BlockChainService

  note as Info
  In this concept <b>BlockNumberStorage.set</b> <u>unreachable</u>
  in <b>BlockNumberState.bindedSet</b> so storage will <u>not update</u>
  on <i>block</i> event
  end note
}

package concept2 {
  class BlockNumberState2 {
    bindedSet(value)
    set(value)
    get()
    firsSubscribe()
    lastSubscribe()
    async sync()
  }

  class BlockChainService2 {
    on(event, callback)
    removeEventListener(event, callback)
    getBlockChainNumber()
  }

  class BlockNumberStorage2 {
    get()
    set(value)
    remove(value)
  }

  BlockNumberState2 *-- BlockNumberStorage2
  BlockNumberState2 *-- BlockChainService2

  note as Info2
  In this concept we should handle situation when
  <b>BlockNumberStorage2.get</b> is null and extend BlockNumberState2
  with method <i>sync</i> which will call <b>BlockChainService2.getBlockChainNumber</b>
  and <i>throw Error</i> if <b>BlockNumberState2.get !== BlockNumberStorage2.get</b>
  end note
}

@enduml
