import React from 'react';
import GridBase from '../../../modules/grid-base/GridBase';
import {TYPE} from '../../../config/apis';
import Button from '../../../components/button';
import CreateForm from '../forms/CreateForm';
import EditForm from '../forms/EditForm';
import {padLeadingZeros} from '../../../utils';
import moment from 'moment';
import ConfirmDialog from '../../../components/dialog/Confirm';
import axios from '../../../axios/mainAxios';
import {toast} from 'react-toastify';


class TypeGrid extends GridBase {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            columns:[
                {name:'stt', title: 'STT'},
                { name:'name', title:'Name'},
                { name: 'roles', title: 'Roles'},
                { name: 'createdAt', title: 'Created At' },
                { name: 'updatedAt', title: 'Updated At' },
                { 
                    name:'action', 
                    title: 'Actions',
                    getCellValue: row=>(<div><Button onClick={()=>this.onEditRow(row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                    <Button onClick={()=>this.onDeleteRow(row)} styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button></div>)
                }
            ],
            apiGet:TYPE.get,
            tableColumnExtensions:[
                {columnName: 'action', width:250},
                {columnName:'createdAt',width:'200px'},
                {columnName:'updatedAt', width:'200px'}
            ],
            dateRangeColumns:['createdAt', 'updatedAt'],
            dateColumns:['createdAt', 'updatedAt'],
            regexColumns:['name'],
            arrayColumns:['roles']
            
        }
    }
    onAddRow = ()=>{
        this.modalRef.onShow(<CreateForm onClose={this.onCloseModal} onReload={this.fetchData}/>)
    }
    onEditRow = (row)=>{
        this.modalRef.onShow(<EditForm onClose={this.onCloseModal} onReload={this.fetchData} data={row}/>)
    }
    onDeleteRow = (row) =>{
        const onHandleDelete = ()=>{
            axios.delete(TYPE.delete,{params:{id:row._id}})
            .then(()=>{
                toast.success('Xóa thành công');
                this.onCloseModal();
                this.fetchData();
            })
            .catch(err=>{
                console.log(err);
            })
        }
        this.modalRef.onShow(<ConfirmDialog title="Do you actually want to delete this item ?" content={row.email} onClose={this.onCloseModal} onOk={onHandleDelete}/>)
    }
}

export default TypeGrid;