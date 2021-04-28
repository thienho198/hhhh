import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '../../../components/button';
import {useForm, Controller} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from '../../../axios/mainAxios';
import {ROLE} from '../../../config/apis';
import {toast} from 'react-toastify';
import FormControl from '@material-ui/core/FormControl';

const Form = props =>{
    const {role = '', resource='', attributes=''} = props.data || {};
    const { handleSubmit, errors, control, watch} = useForm();
    const watchFields = watch(["action"]);
    const onSubmit = ()=>{
        const submitData = control.getValues();
            axios.post(ROLE.create,submitData)
            .then(result=>{
                props.onReload && props.onReload();
                props.onClose && props.onClose();
                toast.success('Tạo role thành công');
            })
            .catch(error=>{
                console.log(error)
            })
    }
    return (
        <div className="role-form-edit" style={{ padding:"30px", borderRadius:'4px'}}>
            <div style={{fontSize:"20px", marginBottom:'30px'}}>Create</div>
            <div className="row">
                <div className="col-md-6 mb-2">
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
                <div className="col-md-6 mb-2">
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
            <div className="row mb-4">
                <div className="col-md-6 mb-2">
                    <FormControl error={errors["action"]} fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Action</InputLabel>
                    <Controller 
                        defaultValue={null}
                        control={control} 
                        name="action"
                        rules={{ required: 'Action is required' }}
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
                    </FormControl>
                    <ErrorMessage errors={errors} name="action" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                {(watchFields.action === 'read:any' || watchFields.action === 'read:own') && 
                    <div className="col-md-6 mb-2">
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
                }
                
            </div>
            <Button onClick={handleSubmit(onSubmit)} variant="outlined" color="primary">Create</Button>
        </div>
    )
}

export default Form;