import {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {Safello} from '../../src/integration/Safello';


describe('Safello', () => {
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
