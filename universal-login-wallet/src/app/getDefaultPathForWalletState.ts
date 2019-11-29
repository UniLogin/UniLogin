export const getDefaultPathForWalletState = (walletState: any) => {
  switch(walletState) {
    case 'Future':
      return '/create';
    case 'Deployed':
      return '/wallet';
    case 'None':
      return '/welcome';
    case 'Deploying':
      return '/create';
  }
}