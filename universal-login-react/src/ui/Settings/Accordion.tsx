import React, {ReactNode, useState} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './../styles/accordion.css';
import './../styles/accordionDefaults.css';

interface AccordionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const Accordion = ({title, subtitle, children}: AccordionProps) => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return (
    <div className="accordion">
      <button onClick={toggle} className={`accordion-btn ${visible ? 'expanded' : ''}`}>
        <div>
          <h2 className="accordion-title">{title}</h2>
          <p className="accordion-subtitle">{subtitle}</p>
        </div>
      </button>
      <TransitionGroup>
        {visible
          ? <CSSTransition timeout={300} classNames="accordion-content">
            <div className="accordion-content">
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
