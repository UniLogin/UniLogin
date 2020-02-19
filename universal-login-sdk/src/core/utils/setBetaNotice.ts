import UniversalLoginSDK from '../../api/sdk';
import {isPrivateMode} from './isPrivateMode';

export function setBetaNotice(sdk: UniversalLoginSDK) {
  const {name} = sdk.getRelayerConfig().chainSpec;
  let notice = `This is beta version running on ${name}`;
  if (await isPrivateMode()) {
    notice = `Warning! Please not use incognito mode. ${notice}`;
  }
  sdk.setNotice(notice);
}
