import daiIcon from '../../ui/assets/icons/dai.svg';
import saiIcon from '../../ui/assets/icons/sai.svg';
import ethIcon from '../../ui/assets/icons/ether.svg';

export const getIconForToken = (symbol: string) => {
  switch (symbol) {
    case 'DAI':
      return daiIcon;
    case 'SAI':
      return saiIcon;
    case 'ETH':
      return ethIcon;
    default:
      return undefined;
  }
};
