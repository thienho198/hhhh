import React from 'react';
import GroupGridBase from '../../../modules/group-grid/GroupGrid';
import {ROLE} from '../../../config/apis'
import EditForm from '../forms/EditForm';
import CreateForm from '../forms/CreateForm';
import ConfirmDialog from '../../../components/dialog/Confirm';
import axios from '../../../axios/mainAxios';
import {toast} from 'react-toastify';
class RoleGroupGrid extends GroupGridBase {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            apiGet:ROLE.get,
            columns:[
            { name:'role', title:'Role'},
            { name: 'resource', title: 'Resource' },
            { name: 'action', title: 'Action' },
            { name: 'attributes', title: 'Attributes' },
            { name: 'createdAt', title: 'Created At' },
            { name: 'updatedAt', title: 'Updated At' }
            ],
            grouping:[{ columnName: 'role' },{ columnName: 'resource' }]
        }
    }

    onEditRow = (row)=>{
        this.modalRef.onShow(<EditForm onClose={this.onCloseModal} onReload={this.fetchData} data={row}/>)
    }

    onAddRow = ()=>{
        this.modalRef.onShow(<CreateForm onClose={this.onCloseModal} onReload={this.fetchData}/>)
    }

    onDeleteRow = (row) =>{
        const onHandleDelete = ()=>{
            axios.delete(ROLE.delete,{params:{id:row._id}})
            .then(()=>{
                toast.success('Xóa thành công');
                this.onCloseModal();
                this.fetchData();
            })
            .catch(err=>{
                console.log(err);
            })
        }
        this.modalRef.onShow(<ConfirmDialog title="Do you actually want to delete this item ?" content={row.role +' '+ row.resource + ' '+row.action} onClose={this.onCloseModal} onOk={onHandleDelete}/>)
    }

}

export default RoleGroupGrid;