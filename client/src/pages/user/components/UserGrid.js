import React from 'react';
import GridBase from '../../../modules/grid-base/GridBase';
import {ACCOUNT} from '../../../config/apis';
import Button from '../../../components/button';

class UserGrid extends GridBase {
    constructor(props) {
        super(props);

        const width = window.innerWidth;
        this.state = {
            ...this.state,
            columns:[
                {name:'stt', title: 'STT', width:50},
                { name:'email', title:'Email'},
                { name: 'birthday', title: 'Birth day' },
                { name: 'phone', title: 'Phone' },
                {
                    name: 'type',
                    title: 'Type',
                    getCellValue: row => (row.type ? row.type.name : undefined),
                },
                { name: 'createdAt', title: 'Created At' },
                { name: 'updatedAt', title: 'Updated At' },
                { 
                    name:'action', 
                    title: 'Actions',
                    getCellValue: row=>(<div><Button onClick={()=>this.onEditRow(row.row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                    <Button onClick={()=>this.onDeleteRow(row.row)} styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button></div>)
                }
            ],
            apiGet:ACCOUNT.getList,
            defaultColumnWidths:[
                {columnName:'stt', width:'80px'},
                {columnName:'email', width: width<768 ? '200px': 'auto'},
                {columnName:'birthday', width:'120px'},
                {columnName:'phone', width:'120px'},
                {columnName:'type', width:'120px'},
                {columnName:'createdAt', width:'120px'},
                {columnName:'updatedAt', width:'120px'},
                {columnName:'action', width:'250px'},
            ]
            
        }
    }
}

export default UserGrid;