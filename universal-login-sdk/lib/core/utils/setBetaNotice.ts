import UniversalLoginSDK from '../../api/sdk';

export async function setBetaNotice(sdk: UniversalLoginSDK) {
  const {name} = (await sdk.getRelayerConfig())!.chainSpec;
  sdk.setNotice(`This is beta version running on ${name}`);
}
