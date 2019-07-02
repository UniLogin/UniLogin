import React from 'react';
import {CustomMemoryRouter} from '../helpers/CustomMemoryRouter';
import {ServiceContext, Services} from '../../../src/ui/createServices';
import {mount} from 'enzyme';

export const mountWithContext = (component: any, value: Services, initialEntries = ['/']) =>
  mount(
    <ServiceContext.Provider value={value}>
      <CustomMemoryRouter initialEntries={initialEntries}>
        {component}
      </CustomMemoryRouter>
    </ServiceContext.Provider>);
