/**
 * Copyright (c) 2016 Konstantin Kulinicenko.
 * Licensed under the MIT License (MIT), see
 * https://github.com/40818419/react-code-input
 *
 * Some modifications made for UniLogin.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../styles/base/components/reactCodeInput.sass';

const BACKSPACE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;
const E_KEY = 69;

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export type InputModeTypes =
    'verbatim' | 'latin' | 'latin-name' | 'latin-prose' |
    'full-width-latin' | 'kana' | 'kana-name' | 'katakana' |
    'numeric' | 'tel' | 'email' | 'url';

export interface ReactCodeInputProps {

  // Type of input accept
  type?: 'text' | 'number' | 'password' | 'tel';

  // Allowed amount of characters to enter.
  fields?: number;

  // Value of the input
  value?: string;

  // Get the full value of the input on every change
  onChange?: (value: string) => void;

  // Setting the name of component.
  name: string;

  // Marks the given fields as "touched" to show errors.
  touch?: (name: string) => void;

  // Clears the "touched" flag for the given fields.
  untouch?: (name: string) => void;

  // Add classname to the root element.
  className?: string;

  isValid?: boolean;

  // When present, it specifies that the element should be disabled.
  disabled?: boolean;

  // Setting the styles of container element.
  style?: React.CSSProperties;

  // Setting the className of each input-wrapper
  wrapperClassName?: string;

  // Setting the className of each input
  inputClassName?: string;

  // Setting the styles of each input field.
  inputStyle?: React.CSSProperties;

  // Setting the styles of each input field if isValid prop is false.
  inputStyleInvalid?: React.CSSProperties;

  // Setup autofocus on the first input, true by default.
  autoFocus?: boolean;

  //
  forceUppercase?: boolean;

  // Filter characters on key down.
  filterKeyCodes?: Array<number>;

  // Filter characters.
  filterChars?: Array<string>;

  // Filter above acts as blacklist if false, whitelist if true; false by default.
  filterCharsIsWhitelist?: boolean;

  // The pattern prop specifies a regular expression that the element's value is checked against.
  pattern?: string;

  // The inputMode prop tells the browser on devices with dynamic keyboards which keyboard to display.
  inputMode: InputModeTypes;

}

export class ReactCodeInput extends Component<ReactCodeInputProps, any> {
  private textInput: HTMLInputElement[];
  private uuid: string;

  constructor(props: ReactCodeInputProps) {
    super(props);

    const {fields, type, isValid, disabled, filterKeyCodes, forceUppercase} = props;
    let {value} = props;

    if (forceUppercase) {
      value = value!.toUpperCase();
    }

    this.state = {
      value,
      fields,
      type,
      input: [],
      isValid,
      disabled,
      filterKeyCodes,
    };

    for (let i = 0; i < Number(this.state.fields); i += 1) {
      if (i < 32) {
        const value = this.state.value[i] || '';
        this.state.input.push(value);
      }
    }

    this.textInput = [];

    this.uuid = uuidv4();
  }

  UNSAFE_componentWillReceiveProps(nextProps: ReactCodeInputProps) {
    this.setState({
      isValid: nextProps.isValid,
      value: nextProps.value,
      disabled: nextProps.disabled,
    });
  }

  handleBlur(e: any) {
    this.handleTouch(e.target.value);
  }

  handleTouch(value: any) {
    const {touch, untouch, name} = this.props;

    if (typeof touch === 'function' && typeof untouch === 'function') {
      if (value === '') {
        touch(name);
      } else {
        untouch(name);
      }
    }
  }

  handleChange(e: any) {
    const {filterChars, filterCharsIsWhitelist} = this.props;

    let value = String(e.target.value);

    if (this.props.forceUppercase) {
      value = value.toUpperCase();
    }

    if (this.state.type === 'number') {
      value = value.replace(/[^\d]/g, '');
    }

    /** Filter Chars */
    value = value.split('').filter(currChar => {
      if (filterCharsIsWhitelist) {
        return filterChars!.includes(currChar);
      }
      return !filterChars!.includes(currChar);
    }).join('');

    let fullValue = value;

    if (value !== '') {
      const input = this.state.input.slice();

      if (value.length > 1) {
        value.split('').map((chart, i) => {
          if (Number(e.target.dataset.id) + i < this.props.fields!) {
            input[Number(e.target.dataset.id) + i] = chart;
          }
          return false;
        });
      } else {
        input[Number(e.target.dataset.id)] = value;
      }

      input.map((s: any, i: number) => {
        if (this.textInput[i]) {
          this.textInput[i].value = s;
        }
        return false;
      });

      const newTarget = this.textInput[e.target.dataset.id < input.length
        ? Number(e.target.dataset.id) + 1
        : e.target.dataset.id];

      if (newTarget) {
        newTarget.focus();
        newTarget.select();
      }

      fullValue = input.join('');

      this.setState({value: input.join(''), input});
    }

    if (this.props.onChange && fullValue) {
      this.props.onChange(fullValue);
    }

    this.handleTouch(fullValue);
  }

  handleKeyDown(e: any) {
    const target = Number(e.target.dataset.id);
    const nextTarget = this.textInput[target + 1];
    const prevTarget = this.textInput[target - 1];

    let input,
      value;

    if (this.state.filterKeyCodes.length > 0) {
      this.state.filterKeyCodes.map((item: string) => {
        if (item === e.keyCode) {
          e.preventDefault();
          return true;
        }
      });
    }

    switch (e.keyCode) {
      case BACKSPACE_KEY:
        e.preventDefault();
        this.textInput[target].value = '';
        input = this.state.input.slice();
        input[target] = '';
        value = input.join('');

        this.setState({value, input});
        if (this.textInput[target].value === '') {
          if (prevTarget) {
            prevTarget.focus();
            prevTarget.select();
          }
        }
        if (this.props.onChange) {
          this.props.onChange(value);
        }
        break;

      case LEFT_ARROW_KEY:
        e.preventDefault();
        if (prevTarget) {
          prevTarget.focus();
          prevTarget.select();
        }
        break;

      case RIGHT_ARROW_KEY:
        e.preventDefault();
        if (nextTarget) {
          nextTarget.focus();
          nextTarget.select();
        }
        break;

      case UP_ARROW_KEY:
        e.preventDefault();
        break;

      case DOWN_ARROW_KEY:
        e.preventDefault();
        break;

      case E_KEY: // This case needs to be handled because of https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in
        if (e.target.type === 'number') {
          e.preventDefault();
          break;
        }
        break;

      default:
        break;
    }

    this.handleTouch(value);
  }

  render() {
    const {className, type, autoFocus, style, pattern, inputMode, inputClassName = '', wrapperClassName} = this.props;
    const {disabled, input, isValid} = this.state;

    return (
      <div className={classNames(className, 'react-code-container')}>
        {input.map((value: any, i: number) => {
          return (
            <div className={`${wrapperClassName || 'react-code-wrapper'} ${value && 'it-has-value'}`} style={{display: 'inline-block'}} key={`input_wrapper_${i}`}>
              <input
                ref={(ref) => {
                  this.textInput[i] = ref!;
                }}
                id={`${this.uuid}-${i}`}
                data-id={i}
                autoFocus={autoFocus && i === 0}
                value={value}
                type={type}
                min={0}
                max={9}
                maxLength={input.length === i + 1 ? 1 : input.length}
                className={`${inputClassName} react-code-input ${!isValid && 'not-valid'} ${disabled && 'disabled'}`}
                style={style}
                autoComplete="off"
                onFocus={(e) => e.target.select()}
                onBlur={(e) => this.handleBlur(e)}
                onChange={(e) => this.handleChange(e)}
                onKeyDown={(e) => this.handleKeyDown(e)}
                disabled={disabled}
                data-valid={isValid}
                pattern={pattern}
                inputMode={inputMode}
              />
            </div>
          );
        })}
      </div>
    );
  }

  static defaultProps: any;
  static propTypes: any;
}

ReactCodeInput.defaultProps = {
  autoFocus: true,
  isValid: true,
  disabled: false,
  forceUppercase: false,
  fields: 4,
  value: '',
  type: 'text',
  filterKeyCodes: [189, 190],
  filterChars: ['-', '.'],
  filterCharsIsWhitelist: false,
};

ReactCodeInput.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'password', 'tel']),
  fields: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  touch: PropTypes.func,
  untouch: PropTypes.func,
  className: PropTypes.string,
  isValid: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  inputStyleInvalid: PropTypes.object,
  autoFocus: PropTypes.bool,
  forceUppercase: PropTypes.bool,
  filterKeyCodes: PropTypes.array,
  filterChars: PropTypes.array,
  filterCharsIsWhitelist: PropTypes.bool,
  pattern: PropTypes.string,
  inputMode: PropTypes.oneOf([
    'verbatim', 'latin', 'latin-name', 'latin-prose',
    'full-width-latin', 'kana', 'kana-name', 'katakana',
    'numeric', 'tel', 'email', 'url',
  ]),
};
