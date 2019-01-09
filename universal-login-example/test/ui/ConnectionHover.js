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
  const wrapper = mount(<ConnectionHoverView 
    creations={creations}
    connections={connections} 
    identity={identity}
  />);
  
  it('contains create and connect text if connections and creations exists', () => {
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
    wrapper.setProps({connections: emptyConnections});

    expect(wrapper.contains(<button>create</button>)).to.be.true;
    expect(wrapper.contains(<button>connect</button>)).to.be.false;
    expect(wrapper.contains(<button>recover</button>)).to.be.false;
    expect(wrapper.contains(
      <span className="identity">{creations[0]}</span>
    )).to.be.true;
  });

  it('should react on identity change', () => {
    wrapper.setProps({connections: emptyConnections, identity: 'a'});
    
    expect(wrapper.text()).to.eq('');
    expect(wrapper.contains(
      <span className="identity">{creations[0]}</span>
    )).to.be.false;
    expect(wrapper.find('create')).to.have.lengthOf(0);
    expect(wrapper.find('connect')).to.have.lengthOf(0);
    wrapper.setProps({identity: 'al'});
    expect(wrapper.contains(<button>create</button>)).to.be.true;
    expect(wrapper.text()).to.contain(creations[0]);
    expect(wrapper.text()).to.contain(identity);
  });

  it('simulate on next click', () => {
    const onNextClick = sinon.spy();
    wrapper.setProps({onNextClick});
    wrapper.find('button').simulate('click');
    expect(onNextClick).to.have.been.called;
  });
});
