import React from 'react';
import GroupGridBase from '../../../modules/group-grid/GroupGrid';
import {ROLE} from '../../../config/apis'
import EditForm from '../forms/EditForm';
import CreateForm from '../forms/CreateForm';

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

}

export default RoleGroupGrid;