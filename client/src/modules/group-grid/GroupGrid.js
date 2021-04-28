import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditColumn,
    TableGroupRow,
    PagingPanel,
  } from '@devexpress/dx-react-grid-material-ui';
import {
    GroupingState,
    IntegratedGrouping,
    EditingState,
    PagingState,
    CustomPaging,
    IntegratedPaging,
    DataTypeProvider
} from '@devexpress/dx-react-grid';
import moment from 'moment';
import axios from '../../axios/mainAxios';
import { Loading } from './theme-sources/material-ui/components/loading';
import Button from '../../components/button';
import Modal from '../../components/mymodal';
import {ReactComponent as PlusIcon} from '../../components/button/icons/Plus.svg';
import styled from 'styled-components';

const Toolbar = styled.div`
display:flex;
justify-content:flex-end;
margin-bottom:15px;
`

const DateFormatter = ({ value }) => moment(value).format('DD-MM-YYYY');

const DateTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={DateFormatter}
      {...props}
    />
  );

class GroupGridBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            data:[],
            currentPage:1,
            pageSize:10,  
            loading: false,
            totalCount: 0,
            apiGet:'',
            apiDelete:'',
            grouping:[]
            }
    }

    fetchData = ()=>{
        if(this.state.apiGet){
            this.setState({loading: true});
            axios.get(this.state.apiGet)
            .then(res=>{
                this.transferData(res);
            })
            .catch(err=>{
                this.setState({loading: false})
                console.log(err)
            })
        }
    }
    transferData =(res)=>{
        this.setState({data:res.data.data,totalCount:res.data.data.length, loading:false});
    }

    componentDidMount(){
        this.fetchData()
    }
    onEditRow = (row) =>{

    }
    onDeleteRow = (row) =>{

    }
    onAddRow = () =>{

    }
    onCloseModal = () =>{
        this.modalRef.onBlur()
    }
    renderAction = (row, children)=>{
        return (
            <div className="action-row">
                <Button onClick={()=>this.onEditRow(row.row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                <Button onClick={()=>this.onDeleteRow(row.row)} styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button>
            </div>
        ) 
    }
    renderHeaderAction = (children)=>{
        return <div className="action-header">Actions</div>
    }
    renderToolBar = ()=>{
        return (
            <Toolbar>
                <Button onClick={this.onAddRow} styleButton={{backgroundColor:'#5269fc', color:'white'}} size="medium"  iconLeft={<PlusIcon width={15} height={15}/>}>Add New Role</Button>
            </Toolbar>
        ) 
    }
    render() {
        const {data, columns, loading, currentPage, pageSize, totalCount,grouping} = this.state;
            return (
                <div>
                    {this.renderToolBar()}
                    <Paper>
                        <Grid   
                            rows={data}
                            columns={columns}
                        >
                            <GroupingState
                                grouping={grouping}
                            />
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={(page)=>this.setState({currentPage: page})}
                                pageSize={pageSize}
                            />
                            <EditingState />
                            <CustomPaging
                                totalCount={totalCount}
                            />
                            
                            <IntegratedPaging />
                            <IntegratedGrouping />
                            <DateTypeProvider
                             for={['createdAt','updatedAt']}
                            />
                            <Table noDataRowComponent={()=>loading ? <Loading/> : <div>No data</div>}/>
                            <TableHeaderRow />

                            <TableGroupRow />

                            <TableEditColumn width={250} cellComponent={this.renderAction} headerCellComponent={this.renderHeaderAction}/>
                            <PagingPanel 
                             pageSizes={[10,15,20]}
                            />
                        </Grid>
                    </Paper> 
                    <Modal getRef={ref=>this.modalRef = ref} />
                </div>
            )
    }
    
}

export default GroupGridBase;