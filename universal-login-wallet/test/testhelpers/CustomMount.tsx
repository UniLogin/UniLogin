import React from 'react';
import {MemoryRouter} from 'react-router';
import {ServiceContext, Services} from '../../src/ui/createServices';
import {mount} from 'enzyme';

export const mountWithContext = (component: any, value: Services, initialEntries = ['/dashboard']) =>
  mount(
    <ServiceContext.Provider value={value}>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </ServiceContext.Provider>,
  );
