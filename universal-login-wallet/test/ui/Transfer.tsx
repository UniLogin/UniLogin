import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../src/ui/App';
import {createServices, ServiceContext} from '../../src/services/Services';
import getConfig from '../../config/getConfig';
import { MemoryRouter } from 'react-router-dom';

configure({adapter: new Adapter()});
const services = createServices(getConfig());

const mountWithRouterAndContextProvider = (component: any, initialEntries = ['/']) => 
  mount(<ServiceContext.Provider value={services}>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </ServiceContext.Provider>);

describe('UI: Transfer', () => {
  it('Creates wallet and transfers tokens', () => {
    const appWrapper = mountWithRouterAndContextProvider(<App/>, ['/', '/login']);
    console.log(appWrapper.html());
  });
});
