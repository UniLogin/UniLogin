import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {TestDiv} from '../src/test';
import {configure, ReactWrapper, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Safello} from '../src';

configure({adapter: new Adapter()});

describe('Test congiguration', () => {
  it('should be executed', () => {
    const reactWrapper: ReactWrapper = mount(<TestDiv />);
    expect(reactWrapper.text().includes('Test div')).to.be.true;
  });

  it('should be mounted', async () => {
    const safelloUrlConfig = {
      language: 'en',
      crypto: 'eth',
      country: 'other',
      contractAddress: '0x'
    };
    expect(() => mount(<Safello {...safelloUrlConfig} />)).to.not.throw;
  });
});
