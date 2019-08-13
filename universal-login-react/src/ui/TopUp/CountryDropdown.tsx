import React, {useState} from 'react';
import gbFlagIcon from './../assets/flags/gb.svg';
import frFlagIcon from './../assets/flags/fr.svg';
import deFlagIcon from './../assets/flags/de.svg';
import plFlagIcon from './../assets/flags/pl.svg';

export interface CountrySelectProps {
  selectedCountry: string;
  setCountry: (selectedCountry: string) => void;
  setCode: (code: string) => void;
}

export const CountryDropdown = ({selectedCountry, setCountry, setCode}: CountrySelectProps) => {
  const [expanded, setExpanded] = useState(false);

  const onDropdownItemClick = (selectedCountry: string, code: string) => {
    setExpanded(false);
    setCountry(selectedCountry);
    setCode(code);
  };

  return(
    <div className="country-select">
        {placeholderData.map(({country, flag}) => {
            if (country === selectedCountry) {
              return(
                <button
                  onClick={() => setExpanded(!expanded)}
                  key={country}
                  className={`country-select-btn country-select-toggle ${expanded ? 'expanded' : ''}`}
                >
                  <img src={flag} alt="" className="country-select-img"/>
                  <p className="country-select-text">{country}</p>
                </button>
              );
            }
          })
        }
        {expanded &&
          <ul className="country-select-list">
              {placeholderData
                .filter(({country}) => country !== selectedCountry)
                .map(({country, flag, code}) => (
                  <li key={country} className="country-select-item">
                    <CountryDropdownItem
                      country={country}
                      flag={flag}
                      code={code}
                      onDropdownItemClick={onDropdownItemClick}
                    />
                  </li>
                ))
              }
          </ul>
        }
    </div>
  );
};

interface CountryDropdownItemProps {
  country: string;
  flag: string;
  code: string;
  onDropdownItemClick: (selectedCountry: string, code: string) => void;
}

const CountryDropdownItem = ({country, flag, onDropdownItemClick, code}: CountryDropdownItemProps) => (
  <button onClick={() => onDropdownItemClick(country, code)} className="country-select-btn">
    <img src={flag} alt={`${country} flag`} className="country-select-img"/>
    <p className="country-select-text">{country}</p>
  </button>
);

const placeholderData = [
  {
    country: 'France',
    flag: frFlagIcon,
    code: 'EUR',
  },
  {
    country: 'Germany',
    flag: deFlagIcon,
    code: 'EUR',
  },
  {
    country: 'Poland',
    flag: plFlagIcon,
    code: 'PLN',
  },
  {
    country: 'United Kingdom',
    flag: gbFlagIcon,
    code: 'GBP',
  },
];
