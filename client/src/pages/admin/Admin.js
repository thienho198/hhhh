import React from 'react';
import './styles/admin.scss';
import axios from '../../axios/mainAxios';
import {ROLE} from '../../config/apis';
import Paper from '@material-ui/core/Paper';
import { GridExporter } from '@devexpress/dx-react-grid-export';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
  TableGroupRow,
  Toolbar,
  ExportPanel,
  VirtualTable,
  PagingPanel,
  TableFixedColumns
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
import Button from '../../components/button';
import Modal from '../../components/mymodal';
import saveAs from 'file-saver';
import EditForm from './forms/EditForm';
import { Loading } from './theme-sources/material-ui/components/loading';

const DateFormatter = ({ value }) => '123';

const DateTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={DateFormatter}
      {...props}
    />
  );

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.exporterRef = React.createRef()
        this.state = {
            columns:[
                { name:'role', title:'Role'},
                { name: 'resource', title: 'Resource' },
                { name: 'action', title: 'Action' },
                { name: 'attributes', title: 'Attributes' },
                { name: 'createdAt', title: 'Created At' },
                { name: 'updatedAt', title: 'Updated At' },
              ],
            data:[],
            currentPage:1,
            pageSize:10,  
            loading: false,
            totalCount: 0
        }
    }
    componentDidMount(){
        this.setState({loading: true});
        axios.get(ROLE.get)
        .then(res=>{
            console.log('get success', res.data);
            setTimeout(()=>this.setState({data:res.data.data,totalCount:res.data.data.length, loading:false}),1000)
            
        })
        .catch(err=>{
            this.setState({loading: false})
            console.log(err)
        })
    }
    //#region events
    startExporting = ()=>{
        this.exporterRef.current.exportGrid();
    }
    onSaveExportFile = (workbook)=>{
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
          });
    }
    onEditRowHandler = (rowData) => {
        console.log(rowData);
        this.modalRef.onShow(<EditForm  data={rowData}/>)
    }
    //#region render

    renderAction = (row, children)=>{
        return (
            <div className="action-row">
                <Button onClick={()=>this.onEditRowHandler(row.row)} styleButton={{backgroundColor:'#ffc107', marginRight:'10px'}} styleTitle={{color:'white'}}>Edit</Button>
                <Button styleButton={{backgroundColor:'#dc3545'}} styleTitle={{color:'white'}}>Delete</Button>
            </div>
        ) 
    }
    renderHeaderAction = (children)=>{
        return <div className="action-header">Actions</div>
    }
    render() {
        const {data, columns, loading, currentPage, pageSize, totalCount} = this.state;
        return (
            <div className="admin-page">
                <div className="admin-page__role">
                    <div className="admin-page__role__title">Roles</div>
                    <Paper>
                        <Grid
                            rows={data}
                            columns={columns}
                        >
                            <GroupingState
                                grouping={[{ columnName: 'role' },{ columnName: 'resource' }]}
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
                            {/* <Toolbar/>
                            <ExportPanel startExport={this.startExporting} /> */}
                        </Grid>
                        <GridExporter
                            ref={this.exporterRef}
                            rows={data}
                            columns={columns}
                            onSave={this.onSaveExportFile}
                        />
                    </Paper>
                    <Modal getRef={ref=>this.modalRef = ref} />
                </div>
            </div>
        )
    }
}