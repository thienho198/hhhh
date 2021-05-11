import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditColumn,
    TableGroupRow,
    PagingPanel,
    TableFilterRow
  } from '@devexpress/dx-react-grid-material-ui';
import {
    GroupingState,
    IntegratedGrouping,
    EditingState,
    PagingState,
    CustomPaging,
    IntegratedPaging,
    DataTypeProvider,
    FilteringState, 
    IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import moment from 'moment';
import axios from '../../axios/mainAxios';
import { Loading } from './theme-sources/material-ui/components/loading';
import Button from '../../components/button';
import Modal from '../../components/mymodal';
import {ReactComponent as PlusIcon} from '../../components/button/icons/Plus.svg';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import DateRange from '@material-ui/icons/DateRange';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const StyledToolbar = styled.div`
display:flex;
justify-content:flex-end;
margin-bottom:15px;
`

const FilterIcon = ({ type, ...restProps }) => {
    if (type === 'dateRange') return null;
    return <TableFilterRow.Icon type={type} {...restProps} />;
};

const DateFormatter = ({ value }) => moment(value).format('DD-MM-YYYY');

const FilterDate = props => {
    const handleChangeFrom = (newValueFrom) => {
        const updatedValue = {...props.value};
        updatedValue.from = newValueFrom
        props.onValueChange(updatedValue);
    }

    const handleChangeTo = (valueTo) => {
        const updatedValue = {...props.value};
        updatedValue.to = valueTo
        props.onValueChange(updatedValue);
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div style={{display: 'flex'}}>
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="From"
                    format="MM/dd/yyyy"
                    value={(props.value && props.value.from) || null}
                    onChange={handleChangeFrom}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                />
                 <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="To"
                    format="MM/dd/yyyy"
                    value={(props.value && props.value.to) || null}
                    onChange={handleChangeTo}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                />
            </div>
      </MuiPickersUtilsProvider>
    )
}
const DateTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={DateFormatter}
      editorComponent={FilterDate}
      {...props}
    />
  );

class GroupGridBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            data:[],
            currentPage:0,
            pageSize:10,  
            loading: false,
            totalCount: 0,
            apiGet:'',
            apiDelete:'',
            grouping:[],
            searchValue:'',
            dateFilterOperations:['dateRange'],
            dateColumns:['createdAt', 'updatedAt'],
            filters:[],
            defaultFilters:[],
            regexColumns:['action','attributes'],
            dateRangeColumns:['createdAt', 'updatedAt']
            }
    }

    filterToRegexStr = (type, content)=>{
        let regexStr = '';
        switch(type){
            case 'contains':
                regexStr = content;
                break;
            case  'notContains':
                regexStr = `^((?!${content}).)*$`;
                break;
            case "startsWith":
                regexStr = `^${content}`;
                break;
            case 'endsWith':
                regexStr = `${content}$`;
                break;
            case 'equal':
                regexStr = `^${content}$`;
                break;
            case 'notEqual':
                regexStr = `^(?!${content}$).*$`
                break;
        }
        return regexStr;
    }

    fetchData = ()=>{
        if(this.state.apiGet){
            this.setState({loading: true});
            const params = {page:this.state.currentPage+1, page_size:this.state.pageSize};
            this.state.searchValue &&  (params.search_value = this.state.searchValue);
            
            
            const filtersRegex = {};
            const filtersDateRange = {};
            this.state.filters.forEach(item=>{
                //filter_regex
                if(this.state.regexColumns.indexOf(item.columnName)>=0){
                    filtersRegex['filter_regex_' + item.columnName] = this.filterToRegexStr(item.operation, item.value);
                }
                //filter_date_range
                if(this.state.dateRangeColumns.indexOf(item.columnName)>=0){
                    if(item.value.from && item.value.to){
                        const dateFrom = new Date(item.value.from);
                        dateFrom.setHours(0,0,0,0);
                        filtersDateRange['filter_date_range_from_'+item.columnName] = item.value.from; 
                        const dateTo = new Date(item.value.to);
                        dateTo.setHours(23,59,59,999);
                        filtersDateRange['filter_date_range_to_'+item.columnName] = item.value.to; 
                    }   
                }
            })

            



            axios.get(this.state.apiGet, {params:{...params,...filtersRegex, ...filtersDateRange}})
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
        this.setState({data:res.data.data, totalCount:res.data.count, loading:false});
    }

    componentDidMount(){
        this.fetchData()
    }

    //#region events
    onEditRow = (row) =>{

    }
    onDeleteRow = (row) =>{

    }
    onAddRow = () =>{

    }
    onCloseModal = () =>{
        this.modalRef.onBlur()
    }
    onCurrentPageChange = (page)=>{
        this.setState({currentPage:page}, ()=>{
            this.fetchData()
        })
    }
    onPageSizeChange = (page_size)=>{
        this.setState({pageSize:page_size}, ()=>{
            this.fetchData()
        })
    }
    
    onValueSearchChange = (object)=>{
        const value = object.target.value
            this.setState({searchValue:value}, ()=>{
                this.fetchData()
            })
    }

    onFiltersChange = (filters)=>{
        console.log('filters changed', filters)
       
        // console.log('muahahah', dateFrom)
        this.setState({filters:filters},()=>{
            this.fetchData()
        })
    }

    //#endregion
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
            <StyledToolbar>
                <TextField 
                id="standard-search" 
                placeholder="Search" 
                onChange={this.onValueSearchChange}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button onClick={this.onAddRow} styleButton={{backgroundColor:'#5269fc', color:'white', marginLeft:'20px'}} size="medium"  iconLeft={<PlusIcon width={15} height={15}/>}>Add New Role</Button>
            </StyledToolbar>
        ) 
    }
    render() {
        const {filters, data, columns, loading, currentPage, pageSize, dateFilterOperations, dateColumns, totalCount,grouping} = this.state;
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
                                onCurrentPageChange={this.onCurrentPageChange}
                                onPageSizeChange={this.onPageSizeChange}
                                pageSize={pageSize}
                            />
                            <EditingState />
                            <FilteringState defaultFilters={[]} filters={filters} onFiltersChange={this.onFiltersChange}/>
        
                            <CustomPaging
                                totalCount={totalCount}
                            />
                            <IntegratedGrouping />
                            <DateTypeProvider
                             for={['createdAt','updatedAt']}
                            />
                            <DataTypeProvider
                                for={dateColumns}
                                availableFilterOperations={dateFilterOperations}
                            />
                            <Table noDataRowComponent={()=>loading ? <Loading/> : <div>No data</div>}/>
                            <TableHeaderRow />

                            <TableGroupRow />
                            <TableFilterRow
                            showFilterSelector
                            iconComponent={FilterIcon}
                            // messages={{ month: 'Month equals' }}
                            />
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