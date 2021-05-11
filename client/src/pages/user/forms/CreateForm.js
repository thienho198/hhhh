import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import axios from '../../../axios/mainAxios';
import {toast} from 'react-toastify';
import {ACCOUNT, TYPE} from '../../../config/apis';
import TextField from '@material-ui/core/TextField';
import Button from '../../../components/button';
import {REGEXS} from '../../../config/enum';
import get from 'lodash/get';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const Form = props=>{
    const {handleSubmit, errors, control} = useForm();
    const [listType, setListType] = useState([]);
    useEffect(() => {
        axios.get(TYPE.get,{params:{page:1, page_size:1000}})
        .then(res=>{
            const listType = get(res,'data.data');
            setListType(listType);
        })
    },[])
    const onSubmit = ()=>{
        const submitData = control.getValues();
        const birthdayStrArr = submitData.birthday.split('-');
        const birthdayDate = new Date(birthdayStrArr[0], Number(birthdayStrArr[1])-1, birthdayStrArr[2]);
        submitData.birthday = birthdayDate;
        axios.post(ACCOUNT.create,submitData)
        .then(result=>{
            props.onReload && props.onReload();
            props.onClose && props.onClose();
            toast.success('Tạo account thành công');
        })
        .catch(error=>{
            console.log(error)
        })  
    }
    
    return (
        <div className="form-content">
            <div className="form-content__title">
                Create User
            </div>
            <div className="row">
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="email"
                        rules={{
                                pattern:{value:REGEXS.EMAIL_REGEX, message:'Invalid email'},
                                required:{value:true, message:'Email is required'}
                                }}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["email"]} value={value} onChange={onChange} fullWidth id="user-form-email-field" label="Email" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="email" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="password"
                        rules={{required:{value:true, message:'Password is required'}}}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["password"]} value={value} onChange={onChange} fullWidth id="user-form-password-field" label="Password" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="password" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="firstName"
                        rules={{required:{value:true, message:'First name is required'}}}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["firstName"]} value={value} onChange={onChange} fullWidth id="user-form-password-field" label="First Name" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="firstName" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="lastName"
                        rules={{required:{value:true, message:'Last name is required'}}}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["lastName"]} value={value} onChange={onChange} fullWidth id="user-form-password-field" label="Last Name" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="lastName" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="birthday"
                        rules={{required:{value:true, message:'Birth day is required'}}}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["birthday"]} value={value} onChange={onChange} fullWidth id="user-form-birthday-field" label="Birth Day" defaultValue ={null} type="date" InputLabelProps={{
                                shrink: true,
                              }}/>
                        )}
                    />
                    <ErrorMessage errors={errors} name="birthday" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="phone"
                        rules={{pattern:{value:REGEXS.PHONE_REGEX, message:'Invalid phone number'}}}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["phone"]} value={value} onChange={onChange} fullWidth id="user-form-phone-field" label="Phone Number" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="phone" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-4">
                <FormControl error={errors["type"]} fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                        <Controller 
                        defaultValue={null}
                        control={control} 
                        name="type"
                        rules={{ required: 'Type is required' }}
                        render={({ onChange, onBlur, value }) => (
                            <Select
                            MenuProps={{
                             disableScrollLock: true
                           }}
                             fullWidth
                             labelId="demo-simple-select-helper-label"
                             id="demo-simple-select-helper"                             value={value}
                             onChange={onChange}
                             value={value}
                         >
                             {listType.map(item =><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)}
                         </Select>
                          )}
                    />

                </FormControl>
                <ErrorMessage errors={errors} name="type" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
            </div>
            <Button onClick={handleSubmit(onSubmit)} variant="outlined" color="primary">Create</Button>
        </div>
    )
}

export default Form;
