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
  Deployed: [
    '/dashboard',
    '/create/waiting',
    '/connectionSuccess',
    '/creationSuccess',
    '/debugStorage',
  ],
  Connecting: [
    '/connect/emoji',
    '/debugStorage',
  ],
};
