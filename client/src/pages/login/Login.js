import React from 'react';
import './styles/login-page.scss';
import LoginIntroduce from '../../assets/images/login-introduce.jfif';
import Form from './components/form/Form';

const Login = props=>{
    return (
        <div className="dashboard-login-container">
            <div className="dashboard-login-container__loginform-area">
                <Form />
            </div>
            <div className="dashboard-login-container__introduce">
                <div className="dashboard-login-container__introduce__image"><img alt="login-introduce" src={LoginIntroduce}/></div>
                
            </div>
        </div>
    )
}

export default Login;