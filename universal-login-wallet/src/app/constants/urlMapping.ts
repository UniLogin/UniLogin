const pathsForDeployed = [
  '/dashboard',
  '/create/waiting',
  '/connectionSuccess',
  '/creationSuccess',
  '/debugStorage',
];

const pathsForOnboarding = [
  '/onboarding',
];

const pathsForMigrating = [
  '/dashboard/migration',
];

export const urlMapping: Record<string, string[]> = {
  None: [
    '/onboarding',
    '/welcome',
    '/privacy',
    '/terms',
    '/connect/selector',
    '/connect/chooseMethod',
    '/connect/emoji',
    '/connect/recover',
    '/selectDeployName',
  ],
  Future: [
    '/create/topUp',
    '/debugStorage',
  ],
  Deploying: [
    '/create/waiting',
    '/debugStorage',
  ],
  RequestedCreating: pathsForOnboarding,
  RequestedRestoring: pathsForOnboarding,
  Confirmed: pathsForOnboarding,
  Restoring: pathsForOnboarding,
  RequestedMigrating: pathsForMigrating,
  ConfirmedMigrating: pathsForMigrating,
  Deployed: pathsForDeployed,
  DeployedWithoutEmail: pathsForDeployed,
  Connecting: [
    '/connect/emoji',
    '/debugStorage',
  ],
};
