import React from 'react';
import Input from './components/Input';
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import EmailIcon from './icons/EmailIcon';
import PasswordIcon from './icons/PasswordIcon';
import '../../styles/login-form.scss';
import {login} from '../../../../store/actions/authenticate';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

const Form = props =>{
    const {control, errors, handleSubmit} = useForm();
    const onSubmitHandler = (e)=>{
        const submitData = control.getValues();
        props.login(submitData.username, submitData.password, props.history);
    }
    return (
        <div className="dashboard-login-form">
            <div className="dashboard-login-form__title">Login</div>
            <div className="dashboard-login-form__subtitle">Ready to learn new things...</div>
            <Input error={errors['username']} name="username" placeholder="Your_email@gmail.com" control={control} checkValid={{required:"Email is required!", pattern:{value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message:'Not a valid email address'}}} icon={<EmailIcon height="20" width="20"/>} iconFocus={<EmailIcon color="#5269fc" height="20" width="20"/>} />
            <ErrorMessage errors={errors} name="username" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
            <Input error={errors['password']} type="password" name="password" placeholder="Password" control={control} checkValid={{required:"Password is required!"}} icon={<PasswordIcon height="20" width="20"/>} iconFocus={<PasswordIcon color="#5269fc" height="20" width="20"/>} />
            <ErrorMessage errors={errors} name="password" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
            <button className="dashboard-login-form__button" onClick={handleSubmit(onSubmitHandler)}>Login</button>
        </div>
    )
}
const mapDispatchToProps = dispatch =>{
    return {
        login: (userName, password, history) => dispatch(login(userName,password,history))
    }
}
export default withRouter(connect(null, mapDispatchToProps)(Form));