import React from 'react';
import TreeGridBase from '../../../modules/tree-grid-base/TreeGridBase';
import {MENU} from '../../../config/apis';
import Button from '../../../components/button';
import CreateForm from '../forms/CreateForm';
import EditForm from '../forms/EditForm';
import ConfirmDialog from '../../../components/dialog/Confirm';
import axios from '../../../axios/mainAxios';
import {toast} from 'react-toastify';
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
                    name:'updatedAt',
                    title:'Updated At'
                },
                { 
                    name:'action', 
                    title: 'Actions',
                    getCellValue: row=>(<div><Button onClick={()=>this.onEditRow(row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                    <Button onClick={()=>this.onDeleteRow(row)} styleButton={{backgroundColor:'#dc3545',marginRight:'10px'}} styleTitle={{color:'white'}}>Delete</Button>
                    <Button onClick={()=>this.onAddChild(row)} styleButton={{backgroundColor:'#28a745'}} styleTitle={{color:'white'}}>Add Child</Button>
                    </div>)
                }
            ],
            apiGet:MENU.get,
            treeFor: 'name', 
            booleanColumns:['isActive'],
            tableColumnExtensions:[{columnName:'name', width:'300px'},{columnName: 'action', width:270}]
        }
    }

    onAddRow = () =>{
        this.modalRef.onShow(<CreateForm onClose={this.onCloseModal} onReload={this.fetchData}/>)
    }

    onAddChild = (row)=>{
        this.modalRef.onShow(<CreateForm onClose={this.onCloseModal} onReload={this.fetchData} data={row}/>)
    }

    onEditRow = (row) =>{
        const data = {...row};
        data.requiredTypes = data.requiredTypes.map(item=>item._id);
        this.modalRef.onShow(<EditForm onClose={this.onCloseModal} onReload={this.fetchData} data={data}/>)
    }

    onDeleteRow = (row) =>{
        const onHandleDelete = ()=>{
            axios.delete(MENU.delete,{params:{position:row.position}})
            .then(()=>{
                toast.success('Xóa thành công');
                this.onCloseModal();
                this.fetchData();
            })
            .catch(err=>{
                console.log(err);
            })
        }
        this.modalRef.onShow(<ConfirmDialog title="Do you actually want to delete this item ?" content={row.name} onClose={this.onCloseModal} onOk={onHandleDelete}/>)
    }
}

export default MenuTreeGrid;