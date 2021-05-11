import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import axios from '../../../axios/mainAxios';
import {toast} from 'react-toastify';
import {MENU, TYPE} from '../../../config/apis';
import TextField from '@material-ui/core/TextField';
import Button from '../../../components/button';
import {REGEXS} from '../../../config/enum';
import get from 'lodash/get';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { sub } from 'date-fns/esm';

const Form = props=>{
    const {handleSubmit, errors, control} = useForm({defaultValues:props.data || {}});
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
        submitData.id = props.data._id;
        console.log('submitData', submitData);
        axios.put(MENU.update,submitData)
        .then(result=>{
            props.onReload && props.onReload();
            props.onClose && props.onClose();
            toast.success('Cập nhật menu thành công');
        })
        .catch(error=>{
            console.log(error)
        })  
    }
    return (
        <div className="form-content">
            <div className="form-content__title">
                Update Menu
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-2">
                    <Controller 
                        control={control}
                        name="name"
                        rules={{
                                required:{value:true, message:'Name is required'}
                                }}
                        render={({ onChange, onBlur, value }) => (
                            <TextField error={errors["name"]} value={value} onChange={onChange} fullWidth id="user-form-name-field" label="Name" />
                        )}
                    />
                    <ErrorMessage errors={errors} name="name" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
                <div className="col-md-6 mb-2" style={{minWidth:'200px'}}>
                <FormControl error={errors["requiredTypes"]} fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Required Types</InputLabel>
                        <Controller 
                        control={control} 
                        name="requiredTypes"
                        render={({ onChange, onBlur, value }) => (
                            <Select
                            MenuProps={{
                             disableScrollLock: true
                           }}
                            multiple
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
                <ErrorMessage errors={errors} name="requiredTypes" render={({ message }) => <p className="dashboard-login-form__error">{message}</p>}/>
                </div>
            </div>

            <Button onClick={handleSubmit(onSubmit)} variant="outlined" color="primary">Update</Button>
        </div>
    )
}

export default Form;