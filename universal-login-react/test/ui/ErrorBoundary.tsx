import 'jsdom-global/register';
import {expect} from 'chai';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import {ErrorBoundary} from '../../src/ui/commons/ErrorBoundary';

configure({adapter: new Adapter()});


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
    expect(wrapper.text()).include('Something went wrong...');
  });
});
