import React, { Component } from 'react';
import Collapsible from './Collapsible';
import SettingsAccordionView from '../views/SettingsAccordionView';

class SettingsAccordion extends Component {
  render() {
    return (
      <Collapsible
        title="More settings"
        subtitle="Amount of devices nedeed to make changes"
        icon="icon-settings"
      >
        <SettingsAccordionView />
      </Collapsible>
    );
  }
}

export default SettingsAccordion;
