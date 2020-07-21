export const formatTokenName = (name: string) => {
  switch (name) {
    case 'USD//C':
      return 'USDC';
    default:
      return name;
  }
};
