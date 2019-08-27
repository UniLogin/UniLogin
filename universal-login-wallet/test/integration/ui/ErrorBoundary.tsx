import {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import {ErrorBoundary} from '../../../src/ui/react/ErrorBoundary';


describe('ErrorBoudary', () => {
  it('Should show error view', () => {
    const Component = () => {
      throw new Error('Too bad');
    };
    const ComponentWithError = () => (
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    );
    const wrapper = mount(<ComponentWithError />);
    expect(wrapper.text()).include('Something went wrong...');
  });
});
