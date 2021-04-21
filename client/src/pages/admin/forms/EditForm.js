import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '../../../components/button';
import {useForm, Controller} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from '../../../axios/mainAxios';

const Form = props =>{
    const {role = '', resource='', attributes='', action='create:any', _id} = props.data || {};
    const buttonName = props.buttonName
    const { handleSubmit, errors, control } = useForm();
    const onSubmit = ()=>{
        const submitData = control.getValues();
        console.log(submitData);
        if(props.type==='create'){
            axios.post(props.api,submitData)
            .then(result=>{
                props.reload();
                props.onClose();
            })
            .catch(error=>{
                console.log(error)
            })
        }
        else{
            submitData.id = _id;
            axios.put(props.api,submitData)
            .then(result=>{
                props.reload();
                props.onClose();
            })
            .catch(error=>{
                console.log(error)
            })
        }
    }
    return (
        <div className="role-form-edit" style={{ padding:"30px", borderRadius:'4px'}}>
            <div style={{fontSize:"20px", marginBottom:'30px'}}>{props.type ==='create' ? 'Create' : 'Edit'}</div>
            <div className="row mb-2">
                <div className="col-md-6">
                    <Controller 
                        defaultValue={role}
                        control={control} 
                        name="role"
                        rules={{ required: 'Role is required' }}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["role"]} value={value} onChange={onChange} fullWidth id="role-form-role-field" label="Role" />
                          )}
                    />
                    <ErrorMessage errors={errors} name="role" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6">
                    <Controller 
                        defaultValue={resource}
                        control={control} 
                        name="resource"
                        rules={{ required: 'Resource is required' }}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["resource"]} value={value} onChange={onChange} fullWidth id="role-form-resource-field" label="Resource" />
                          )}
                    />
                    <ErrorMessage errors={errors} name="resource" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
            </div>
            <div className="row" style={{marginBottom:'30px'}}>
                <div className="col-md-6">
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Action
                    </InputLabel>
                    <Controller 
                        defaultValue={action}
                        control={control} 
                        name="action"
                        render={({ onChange, onBlur, value }) => (
                            <Select
                            MenuProps={{
                             disableScrollLock: true
                           }}
                             fullWidth
                             labelId="demo-simple-select-placeholder-label-label"
                             id="demo-simple-select-placeholder-label"
                             value={value}
                             onChange={onChange}
                         >
                             <MenuItem value="create:any">Create Any</MenuItem>
                             <MenuItem value="read:any">Read Any</MenuItem>
                             <MenuItem value="update:any">Update Any</MenuItem>
                             <MenuItem value="delete:any">Delete Any</MenuItem>
                             <MenuItem value="create:own">Create Own</MenuItem>
                             <MenuItem value="read:own">Read Own</MenuItem>
                             <MenuItem value="update:own">Update Own</MenuItem>
                             <MenuItem value="delete:own">Delete Own</MenuItem>
                         </Select>
                          )}
                    />

                </div>
                <div className="col-md-6">
                    <Controller 
                        defaultValue={attributes}
                        control={control} 
                        name="attributes"
                        rules={{ required: 'Attribute is required' }}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["attribute"]} value={value} onChange={onChange} fullWidth id="role-form-attribute-field" label="Attribute" />
                          )}
                    />
                    <ErrorMessage errors={errors} name="attribute" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
            </div>
            <Button onClick={handleSubmit(onSubmit)} variant="outlined" color="primary">{buttonName}</Button>
        </div>
    )
}

export default Form;