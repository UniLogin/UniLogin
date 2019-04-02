import React, { ReactNode } from 'react';
import { useToggler } from '../../hooks';

interface AccordionProps {
  title: string;
  subtitle: string;
  icon?: string;
  children: ReactNode;
}

const Accordion = ({title, subtitle, icon, children}: AccordionProps) => {
  const {visible, toggle} = useToggler();

  return(
    <div className="accordion">
      <button onClick={toggle} className={`accordion-btn ${visible ? 'expanded' : ''}`}>
        <div className="accordion-icon-wrapper">
          <img src={icon} alt="device" className="accordion-icon"/>
        </div>
        <div>
          <h2 className="accordion-title">{title}</h2>
          <p className="accordion-subtitle">{subtitle}</p>
        </div>
      </button>
      {visible
        ? <div className="accordion-content">
            <hr className="accordion-separator"/>
            {children}
          </div>
        : null
      }
    </div>
  );
};

export default Accordion;
