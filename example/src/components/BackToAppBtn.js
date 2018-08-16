import React from 'react';

const BackToAppBtn = props => <button onClick={() => props.setView('MainScreen')} className="btn back-to-app"><span className="back-to-app-text">Back to App</span></button>
 
export default BackToAppBtn;