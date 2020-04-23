import {cast} from '@restless/sanitizers';
import {asApplicationInfo} from '../../../../src';
import {expect} from 'chai';

describe('asApplicationInfo', () => {
  it('works for proper applicationInfo', () => {
    const expectedApplicationInfo = {
      applicationName: 'UniLogin',
      logo: 'UniLogo',
      type: 'unknown',
    };
    const applicationInfo = cast(expectedApplicationInfo, asApplicationInfo);
    expect(applicationInfo).to.deep.eq(expectedApplicationInfo);
  });

  it('fails if parameter missing', () => {
    const applicationInfo = {
      applicationName: 'UniLogin',
      logo: 'UniLogo',
    };
    expect(() => cast(applicationInfo, asApplicationInfo)).throws('Cannot cast');
  });

  it('works if all required fields present', () => {
    const expectedApplicationInfo = {
      applicationName: 'UniLogin',
      logo: 'UniLogo',
      type: 'tablet',
    };
    const appInfoWithExtraField = {...expectedApplicationInfo, extraField: 'extraField'};
    const applicationInfo = cast(appInfoWithExtraField, asApplicationInfo);
    expect(applicationInfo).to.deep.eq(expectedApplicationInfo);
  });

  it('fails if required parameter missing', () => {
    const applicationInfo = {
      applicationName: 'UniLogin',
      logo: 'UniLogo',
      extraField: 'extraField',
    };
    expect(() => cast(applicationInfo, asApplicationInfo)).throws('Cannot cast');
  });
});
