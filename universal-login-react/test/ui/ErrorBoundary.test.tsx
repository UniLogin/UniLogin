import {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import {ErrorBoundary} from '../../src/ui/commons/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('Should show error view', () => {
    const ProblemComponent = () => null;
    const Component = () => (
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    );
    const wrapper = mount(<Component />);
    wrapper.find(ProblemComponent).simulateError('error');
    expect(wrapper.text()).include('Something went wrong');
    wrapper.unmount();
  });
});
