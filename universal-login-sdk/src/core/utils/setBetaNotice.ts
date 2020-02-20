import UniversalLoginSDK from '../../api/sdk';

export function setBetaNotice(sdk: UniversalLoginSDK) {
  const {name} = sdk.getRelayerConfig().chainSpec;
  sdk.setNotice(`This is beta version running on ${name}`);
}
