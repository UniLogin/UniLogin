import React from 'react';

const LogoutBtn = (props) => <button onClick={() => props.setView('Login')} className="btn header-btn">LOGOUT</button>;

export default LogoutBtn;