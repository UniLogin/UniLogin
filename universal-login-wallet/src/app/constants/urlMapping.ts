const pathsForDeployed = [
  '/dashboard',
  '/create/waiting',
  '/connectionSuccess',
  '/creationSuccess',
  '/debugStorage',
];

export const urlMapping: Record<string, string[]> = {
  None: [
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
  Deployed: pathsForDeployed,
  DeployedWithoutEmail: pathsForDeployed,
  Connecting: [
    '/connect/emoji',
    '/debugStorage',
  ],
};
