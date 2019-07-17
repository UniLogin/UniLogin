@startuml Deployment

class Deploy {
  ensName: bytes
  publicKey: address

  ensAddress: address
  resolverAddress: address
  registrarAddress: address

  gasPrice: uint
  signature: bytes
}

@endumla