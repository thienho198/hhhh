import React from 'react';
import GridBase from '../../../modules/grid-base/GridBase';
import {ACCOUNT} from '../../../config/apis';
import Button from '../../../components/button';
import CreateForm from '../forms/CreateForm';
import EditForm from '../forms/EditForm';
import {padLeadingZeros} from '../../../utils';
import moment from 'moment';
class UserGrid extends GridBase {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            columns:[
                {name:'stt', title: 'STT'},
                { name:'email', title:'Email'},
                { name: 'birthday', title: 'Birth day'},
                { name: 'phone', title: 'Phone' },
                {
                    name: 'type',
                    title: 'Type',
                    getCellValue: row => (row.type ? row.type.name : undefined),
                },
                // { name: 'createdAt', title: 'Created At' },
                { name: 'updatedAt', title: 'Updated At' },
                { 
                    name:'action', 
                    title: 'Actions',
                    getCellValue: row=>(<div><Button onClick={()=>this.onEditRow(row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                    <Button onClick={()=>this.onDeleteRow(row)} styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button></div>)
                }
            ],
            apiGet:ACCOUNT.getList,
            tableColumnExtensions:[
                {columnName:'email', width:'300px'},
                {columnName: 'action', width:250},
                {columnName:'stt', width:'80px'},
                {columnName:'birthday', width:'200px'},
                {columnName:'updatedAt', width:'200px'}
            ],
            dateRangeColumns:['createdAt', 'updatedAt','birthday'],
            dateColumns:['createdAt', 'updatedAt', 'birthday'],
            
        }
    }
    onAddRow = ()=>{
        this.modalRef.onShow(<CreateForm onClose={this.onCloseModal} onReload={this.fetchData}/>)
    }
    onEditRow = (row)=>{
        const transferRow = {...row};
        transferRow.type = transferRow.type._id;
        const birthday = new Date(transferRow.birthday);

        transferRow.birthday = `${birthday.getFullYear()}-${padLeadingZeros(birthday.getMonth()+1,2)}-${padLeadingZeros(birthday.getDate(),2)}`;
        this.modalRef.onShow(<EditForm onClose={this.onCloseModal} onReload={this.fetchData} data={transferRow}/>)
    }
}

export default UserGrid;