import React, {ReactNode, useState} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

interface AccordionProps {
  title: string;
  subtitle: string;
  icon?: string;
  children: ReactNode;
}

export const Accordion = ({title, subtitle, icon, children}: AccordionProps) => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return (
    <div className="accordion">
      <button onClick={toggle} className={`accordion-btn ${visible ? 'expanded' : ''}`}>
        <div className="accordion-icon-wrapper">
          <img src={icon} alt="device" className="accordion-icon" />
        </div>
        <div>
          <h2 className="accordion-title">{title}</h2>
          <p className="accordion-subtitle">{subtitle}</p>
        </div>
      </button>
      <TransitionGroup>
        {visible
          ? <CSSTransition timeout={300} classNames="accordion-content">
            <div className="accordion-content">
              <hr className="accordion-separator" />
              {children}
            </div>
          </CSSTransition>
          : null
        }
      </TransitionGroup>
    </div>
  );
};

export default Accordion;
