import 'jsdom-global/register'; 
import React from 'react';
import {mount, configure} from 'enzyme';
import {expect} from 'chai';
import ConnectionHoverView from '../../src/views/ConnectionHoverView';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('(UI) <ConnectionHoverView />', () => {
  const connections = ['al.mylogin.eth'];
  const emptyConnections = [];
  const creations = ['al.poppularapp.eth'];
  const identity = 'al';
  const onKeyDown = sinon.spy();
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(<ConnectionHoverView 
      creations={creations}
      connections={emptyConnections} 
      identity={identity}
      onKeyDown={onKeyDown}
    />);
  });
  
  it('contains create and connect text if connections and creations exists', () => {
    wrapper.setProps({connections});
    expect(wrapper.text()).to.contain('create');
    expect(wrapper.text()).to.contain('connect');
    expect(wrapper.text()).to.contain('recover');
    expect(wrapper.contains(
      <span className="identity">{creations[0]}</span>
    )).to.be.true;
    expect(wrapper.contains(
      <span className="identity">{connections[0]}</span>
    )).to.be.true;
  });

  it('doesn`t contain create and recover if no creations and recovers', () => {
    expect(wrapper.contains(<button className="create">create</button>)).to.be.true;
    expect(wrapper.contains(<button className="connect">connect</button>)).to.be.false;
    expect(wrapper.contains(<button className="recover">recover</button>)).to.be.false;
    expect(wrapper.contains(
      <span className="identity">{creations[0]}</span>
    )).to.be.true;
    expect(onKeyDown).to.not.have.been.called;
  });

  it('should react on identity change', () => {
    wrapper.setProps({identity: 'a'});
  
    expect(wrapper.text()).to.eq('');
    expect(wrapper.contains(
      <span className="identity">{creations[0]}</span>
    )).to.be.false;
    expect(wrapper.contains(<button className="create">create</button>)).to.be.false;
    expect(wrapper.contains(<button className="connect">connect</button>)).to.be.false;

    wrapper.setProps({identity: 'al'});

    expect(wrapper.contains(<button className="create">create</button>)).to.be.true;
    expect(wrapper.text()).to.contain(creations[0]);
    expect(wrapper.text()).to.contain(identity);
  });

  it('simulate on next click', () => {
    const onNextClick = sinon.spy();
    wrapper.setProps({onNextClick});
    wrapper.find('button').simulate('click');
    expect(onNextClick).to.have.been.called;
  });

  it('works on keydown', () => {
    const input = wrapper.find('li');
    input.simulate('keyDown', {keyCode: 40});
    expect(onKeyDown).to.have.been.called;
  });
});
