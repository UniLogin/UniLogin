export const urlMapping: Record<string, string[]> = {
  None: [
    '/welcome',
    '/privacy',
    '/terms',
    '/connect',
    '/connect/selector',
    '/connect/chooseMethod',
    '/connect/emoji',
    '/connect/recover',
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
    '/create/waiting',
    '/connectionSuccess',
    '/creationSuccess',
  ],
  Connecting: [
    '/connect/emoji',
  ],
};
