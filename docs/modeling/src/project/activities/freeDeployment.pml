@startuml
title DEPLOYMENT - free [Relayer Side]


== free deployment ==

website -> Relayer: /deploy + API_KEY in header (gasPrice = 0)
Relayer -> DeploymentHandler: handle(deployment, deviceInfo, API_KEY)
activate DeploymentHandler
group gasPrice = 0
  DeploymentHandler -> PartnerValidator: validate(API_KEY, deviceInfo)
  activate PartnerValidator
  PartnerValidator -> PartnersStore: getApiKey(applicationName)
  PartnersStore -> PartnerValidator: API_KEY
  PartnerValidator -> DeploymentHandler: isPartner
  deactivate PartnerValidator
end
DeploymentHandler -> DeploymentRepository: addDeployment(deployment + partnerId)
deactivate DeploymentHandler

== store free deployments ==
Executor -> DeploymentService: deploy
activate DeploymentService
DeploymentService -> PendingDeployments: getDeployment
DeploymentService -> GasPriceOracle: getCurrentGasPrice
DeploymentService -> Blockchain: sendTx(currentGasPrice)
DeploymentService -> FreeDeploymentStore: deployment + partnerId + currentGasPrice
deactivate DeploymentService

@enduml
