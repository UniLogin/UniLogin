@startuml

title Packages
skinparam componentStyle uml2

interface "ETHERS IF" <<IF-1>> as ETHERS_IF
interface "UL SDK IF" <<IF-2>> as UL_SDK_IF
interface "REACT IF" <<IF-3>> as REACT_IF
interface "ERC1077 SIG IF" <<IF-4>> as SIG_IF
interface "ERC1077 IF\nERC1078 IF" <<IF-5>> as ERC1077ERC1078_IF
interface "RELAYER HTTP JSON IF" <<IF-6>> as RELAYER_HTTP_IF
interface "EXPRESS IF" <<IF-7>> as EXPRESS_IF
interface "ERC20 IF" <<IF-8>> as ERC20_IF
interface "ETH JSON-RPC IF" <<IF-9>> as ETH_JSONRPC_IF

component [ethers] <<cots>>
component [~__universal-login-sdk~__] <<core>>
component [universal-login-example] <<example>>
component [react] <<cots>>
component [universal-login-contracts] <<core>>
component [universal-login-relayer] <<core>>
component [express] <<cots>>
component [openzeppelin-solidity] <<cots>>
component [ethereum-client] <<cots>>

ETHERS_IF -up- [ethers]
REACT_IF -left- [react]
EXPRESS_IF -left- [express]
ERC20_IF -right- [openzeppelin-solidity]
UL_SDK_IF -right- [~__universal-login-sdk~__]
ERC1077ERC1078_IF -right- [universal-login-contracts]
SIG_IF -down- [universal-login-contracts]
RELAYER_HTTP_IF -down- [universal-login-relayer]
ETH_JSONRPC_IF -down- [ethereum-client]

[~__universal-login-sdk~__] -up-> ETHERS_IF : use
[~__universal-login-sdk~__] -down-> SIG_IF : use
[~__universal-login-sdk~__] -down-( RELAYER_HTTP_IF : use
[universal-login-contracts] -right-> ERC20_IF : use
[universal-login-relayer] -right-> ERC1077ERC1078_IF : use
[universal-login-relayer] -left-> EXPRESS_IF : use
[universal-login-relayer] -down-( ETH_JSONRPC_IF : use
[universal-login-example] -up-> ETHERS_IF : use
[universal-login-example] -down-( RELAYER_HTTP_IF : use
[universal-login-example] -right-> UL_SDK_IF : use
[universal-login-example] -left-> REACT_IF : use

skinparam interface {
  backgroundColor<<IF-1>> LightGray
  backgroundColor<<IF-2>> Yellow
  backgroundColor<<IF-3>> LightGray
  backgroundColor<<IF-4>> Yellow
  backgroundColor<<IF-5>> Yellow
  backgroundColor<<IF-6>> Yellow
  backgroundColor<<IF-7>> LightGray
  backgroundColor<<IF-8>> LightGray
  backgroundColor<<IF-9>> LightGray
  borderColor Black
}

skinparam component {
    backgroundColor<<core>> Yellow
    backgroundColor<<cots>> LightGray
    backgroundColor<<example>> LightGreen
}
@enduml