@startuml
title free deployment


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
DeploymentHandler -> DeploymentRepository: addDeployment
deactivate DeploymentHandler
@enduml
