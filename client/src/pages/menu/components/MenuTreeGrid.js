import React from 'react';
import TreeGridBase from '../../../modules/tree-grid-base/TreeGridBase';
import {MENU} from '../../../config/apis';
import Button from '../../../components/button';

class MenuTreeGrid extends TreeGridBase {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            columns:[
                { name:'name', title:'Name'},
                {
                    name:'isActive', 
                    title:'Is Active',
                    getCellValue: row => row.isActive.toString(),
                },
                {
                    name:'requiredTypes',
                    title:'Required Type',
                    getCellValue: row => row.requiredTypes.map(item=>item.name)
                },
                { 
                    name:'action', 
                    title: 'Actions',
                    getCellValue: row=>(<div><Button onClick={()=>this.onEditRow(row.row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                    <Button onClick={()=>this.onDeleteRow(row.row)} styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button></div>)
                }
            ],
            apiGet:MENU.get,
            treeFor: 'name', 
            tableColumnExtensions:[{columnName:'name', width:'300px'},{columnName: 'action', width:250}]
        }
    }
}

export default MenuTreeGrid;