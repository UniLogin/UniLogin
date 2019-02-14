import React from 'react';
import TextBox from './TextBox';

const IdentitySelector = () => {
  const update = async (event: any) => {
    const identity = event.target.value;
    console.log(identity);
  };

  return(<div className="identity-selector">
    <TextBox onChange={update} placeholder={'bob.example.eth'}/>
  </div>)
};

export default IdentitySelector;
