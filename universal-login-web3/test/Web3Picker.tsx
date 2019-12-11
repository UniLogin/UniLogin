import React from 'react';
import {expect} from 'chai';
import {Web3Picker} from '../lib/ui/react/Web3Picker';
import {mount} from 'enzyme';
import {Web3PickerPage} from './helpers/Web3PickerPage';
import {Web3PickerPlayground} from '../lib/ui/react/Web3PickerPlayground';

describe('INT: Web3Picker', () => {
  it('Pick Universal Login', () => {
    const wrapper = mount(<Web3PickerPlayground web3Picker={new Web3Picker('.web3-picker-playground')} />)
    const web3PickerPage = new Web3PickerPage(wrapper);
    wrapper.find('#test-button').simulate('click', {button: 0});
    wrapper.update()
    expect(web3PickerPage.isOpen()).to.be.true;
  });
});
