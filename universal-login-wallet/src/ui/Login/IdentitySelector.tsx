import React from 'react';
import TextBox from './TextBox';
import Suggestions from './Suggestions';

const IdentitySelector = () => {
  const update = async (event: any) => {
    const identity = event.target.value;
    console.log(identity);
  };

  return(<div className="identity-selector">
    <TextBox onChange={update} placeholder={'bob.example.eth'}/>
    <Suggestions 
      connections={['name.my-id.eth']} 
      creations={['name.super-id.eth']} 
      recovers={['name.mylogin.eth']}
    />
  </div>)
};

export default IdentitySelector;
