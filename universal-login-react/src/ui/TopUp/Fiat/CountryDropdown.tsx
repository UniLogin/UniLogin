import React, {useState} from 'react';
import {Country} from '../../../core/models/Country';
import {countries} from '../../../core/utils/countries';
import {ThemedComponent} from '../../commons/ThemedComponent';
import {classForComponent} from '../../utils/classFor';
import '../../styles/base/components/countrySelect.sass';
import '../../styles/themes/UniLogin/components/countrySelectThemeUniLogin.sass';
import '../../styles/themes/Jarvis/components/countrySelectThemeJarvis.sass';
import {Label} from '../../commons/Form/Label';

export interface CountrySelectProps {
  selectedCountry?: string;
  setCountry: (selectedCountry: string) => void;
  setCurrency: (currency: string) => void;
}

export const CountryDropdown = ({selectedCountry, setCountry, setCurrency}: CountrySelectProps) => {
  const [expanded, setExpanded] = useState(false);

  const onDropdownItemClick = (selectedCountry: string, currency: string) => {
    setExpanded(false);
    setCountry(selectedCountry);
  };

  const countrySelectionButton = () => {
    const country = countries.find(({name}) => name === selectedCountry);
    const {name, code} = country || {} as Partial<Country>;
    const flag = code && require(`../../assets/flags/${code.toLowerCase()}.svg`);

    return (
      <button
        onClick={() => setExpanded(!expanded)}
        key={name || 'no-country'}
        className={`unilogin-component-country-select-btn unilogin-component-country-select-toggle ${expanded ? 'expanded' : ''}`}
      >
        {flag && <img src={flag} alt="" className={classForComponent('country-select-img')} />}
        <p className={classForComponent('country-select-text')}>{name || 'Select your country'}</p>
      </button>
    );
  };

  const countrySelectionList = () => {
    if (expanded) {
      return (
        <ul className={classForComponent('country-select-list')}>
          {countries.map(country => (
            <li key={country.name} className={classForComponent('country-select-item')}>
              <CountryDropdownItem
                {...country}
                onDropdownItemClick={onDropdownItemClick}
              />
            </li>
          ))
          }
        </ul>
      );
    }
  };

  return (
    <>
      <Label>Country</Label>
      <ThemedComponent name="country-select">
        {countrySelectionButton()}
        {countrySelectionList()}
      </ThemedComponent>
    </>
  );
};

interface CountryDropdownItemProps extends Country {
  onDropdownItemClick: (selectedCountry: string, currency: string) => void;
}

const CountryDropdownItem = ({name, code, currency, onDropdownItemClick}: CountryDropdownItemProps) => (
  <button onClick={() => onDropdownItemClick(name, currency)} className={classForComponent('country-select-btn')}>
    <img
      src={require(`../../assets/flags/${code.toLowerCase()}.svg`)}
      alt={`${name} flag`}
      className={classForComponent('country-select-img')}
    />
    <p className={classForComponent('country-select-text')}>{name}</p>
  </button>
);
