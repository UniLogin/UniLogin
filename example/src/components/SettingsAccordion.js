import React, { Component } from 'react';
import Collapsible from './Collapsible';
import SettingsIco from '../img/settings.svg';
import SettingsAccordionView from "../views/SettingsAccordionView";

class SettingsAccordion extends Component {
  render() {
    return (
      <Collapsible
        title="More settings"
        subtitle="Amount of devices nedeed to make changes"
        icon={SettingsIco}
      >
        <SettingsAccordionView />
      </Collapsible>
    );
  }
}

export default SettingsAccordion;