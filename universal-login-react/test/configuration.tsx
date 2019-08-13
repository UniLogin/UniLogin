import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {TestDiv} from '../src/test';
import {configure, ReactWrapper, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Safello} from '../src';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';

configure({adapter: new Adapter()});

describe('Test configuration', () => {
  it('should be executed', () => {
    const reactWrapper: ReactWrapper = mount(<TestDiv />);
    expect(reactWrapper.text().includes('Test div')).to.be.true;
  });

  it('should be mounted', async () => {
    expect(() =>
      mount(
        <Safello
          localizationConfig={{country: 'other', language: 'en'}}
          safelloConfig={{
            appId: '1234-5678',
            baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
            addressHelper: true}}
          contractAddress={TEST_ACCOUNT_ADDRESS}
          crypto="eth"
        />
      )
    ).to.not.throw;
  });
});
