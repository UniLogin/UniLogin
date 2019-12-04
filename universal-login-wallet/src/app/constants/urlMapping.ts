export const urlMapping: Record<string, string[]> = {
  None: [
    '/welcome',
    '/privacy',
    '/terms',
    '/connect',
    '/selectDeployName',
  ],
  Future: [
    '/create/topUp',
  ],
  Deploying: [
    '/create/waiting',
  ],
  Deployed: [
    '/wallet',
    '/connectionSuccess',
    '/creationSuccess',
  ],
  Connecting: [
    '/connect',
  ],
};
