import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  TreeDataState,
  CustomTreeData,
  CustomPaging,
  PagingState,
  FilteringState,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  PagingPanel,
  TableFilterRow
} from '@devexpress/dx-react-grid-material-ui';
import axios from '../../axios/mainAxios';
import {buidTreeForCrud} from '../../utils';
import get from 'lodash/get';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import Button from '../../components/button';
import {ReactComponent as PlusIcon} from '../../components/button/icons/Plus.svg';
import {Loading} from '../../components/loading/loading';
import Modal from '../../components/mymodal';
import moment from 'moment';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


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

const getChildRows = (row, rootRows) => (row ? row.children : rootRows);

const cellHeaderComponent = (props)=>{
  return <TableHeaderRow.Cell {...props} style={{height:'10px'}}/>
}

const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'dateRange') return null;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};

const FilterCell = ({filteringEnabled, ...restProps})=>{
  // console.log('fsf', filteringEnabled)
  if(!filteringEnabled) return <div className="action-row"></div>;
  return <TableFilterRow.Cell {...restProps} />;
}
const FilterBoolean = props =>{
  const onChangeValue = (event)=>{
    props.onValueChange(event.target.value);
  }
  return (
        <FormControl fullWidth>
          <InputLabel id="boolean-lable-filter">Boolean</InputLabel>
            <Select
            labelId="boolean-lable-filter"
            id="boolean-lable-filter-id"
            value={props.value}
            onChange={onChangeValue}
          >
            <MenuItem value={'none'}>None</MenuItem>
            <MenuItem value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </FormControl>
  )
}
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
                  format="dd/MM/yyyy"
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
                  format="dd/MM/yyyy"
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

const DateFormatter = ({ value }) => moment(value).format('DD-MM-YYYY');

const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    editorComponent={FilterDate}
    {...props}
  />
);

class TreeGridBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns:[],
      data: [],
      tableColumnExtensions:[],
      treeFor:'',
      apiGet:'',
      searchValue:'',
      totalCount:0,
      pageSize:10,
      currentPage:0,
      filters:[],
      regexColumns:['name'],
      dateRangeColumns:['createdAt', 'updatedAt'],
      dateFilterOperations:['dateRange'],
      booleanColumns:[],
      booleanOperationsFilter:[],
      arrayColumns:['requiredTypes'],
      dateColumns:['createdAt', 'updatedAt'],
      columnFilteringExtensions:[{columnName:'stt', filteringEnabled:false},{ columnName:'action', filteringEnabled:false}]
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
      this.state.searchValue &&  (params.search_value = this.state.searchValue );

      const filtersRegex = {};
      const filtersDateRange = {};
      const filtersBoolean = {};
      const filterArray = {};
          this.state.filters.forEach(item=>{
              //filter_regex
              if(this.state.regexColumns.indexOf(item.columnName)>=0){
                  filtersRegex['filter_regex_' + item.columnName] = this.filterToRegexStr(item.operation, item.value);
              }
              //filter_date_range
              else if(this.state.dateRangeColumns.indexOf(item.columnName)>=0){
                  if(item.value.from && item.value.to){
                      const dateFrom = new Date(item.value.from);
                      dateFrom.setHours(0,0,0,0);
                      filtersDateRange['filter_date_range_from_'+item.columnName] = item.value.from; 
                      const dateTo = new Date(item.value.to);
                      dateTo.setHours(23,59,59,999);
                      filtersDateRange['filter_date_range_to_'+item.columnName] = item.value.to; 
                  }   
              }
              //filter_boolean_
            else if(this.state.booleanColumns.indexOf(item.columnName)>=0){
              if(item.value!=='none'){
                filtersBoolean['filter_boolean_'+item.columnName] = item.value
              } 
            }
            else if(this.state.arrayColumns.indexOf(item.columnName)>=0){
              filterArray['filter_array_regex_'+item.columnName] = this.filterToRegexStr(item.operation, item.value);
            }
          })

      axios.get(this.state.apiGet,{params:{...params,...filtersRegex, ...filtersDateRange,...filtersBoolean,...filterArray}})
      .then(res=>{
        const data = get(res,'data.data');
        data && this.transferData(data);
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }

  componentDidMount(){
    this.fetchData()
  }
  
  transferData(data){
    const treeData = buidTreeForCrud(data);
    this.setState({data:treeData, loading:false});
  }
  //#region events
  onValueSearchChange = (object)=>{
    const value = object.target.value
        this.setState({searchValue:value}, ()=>{
            this.fetchData()
        })
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
  onFiltersChange = (filters)=>{
    console.log('filters changed', filters)
   
    // console.log('muahahah', dateFrom)
    this.setState({filters:filters},()=>{
        this.fetchData()
    })
  }
  //#region render
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
      <Button onClick={this.onAddRow} styleButton={{backgroundColor:'#5269fc', color:'white', marginLeft:'20px'}} size="medium"  iconLeft={<PlusIcon width={15} height={15}/>}>Add New  {this.state.pageName}</Button>
  </StyledToolbar>
    ) 
  }
    render() {
      const {treeFor, data, columns, tableColumnExtensions,currentPage, pageSize, totalCount, loading,filters, columnFilteringExtensions, dateColumns, dateFilterOperations, booleanColumns, booleanOperationsFilter} = this.state;
      return (
        <div>
          {this.renderToolBar()}
          <Paper>
            <Grid
              rows={data}
              columns={columns}
            >
              <TreeDataState defaultExpandedRowIds={[1]} />
              <FilteringState 
                 defaultFilters={[]} 
                 filters={filters} 
                 columnExtensions={columnFilteringExtensions}
                 onFiltersChange={this.onFiltersChange}
                 />
              <PagingState
                  currentPage={currentPage}
                  onCurrentPageChange={this.setCurrentPage}
                  pageSize={pageSize}
                />
              <CustomTreeData
                getChildRows={getChildRows}
              />
               <CustomPaging
                  totalCount={totalCount}
               />
                <DateTypeProvider
                  for={dateColumns}
                />
                <DataTypeProvider
                  for={dateColumns}
                  availableFilterOperations={dateFilterOperations}
                />
                <DataTypeProvider
                  for={booleanColumns}
                  editorComponent={FilterBoolean}
                  availableFilterOperations={booleanOperationsFilter}
                />
              <Table
                noDataRowComponent={()=>loading ? <Loading/> : <div>No data</div>} 
                columnExtensions={tableColumnExtensions}
              />
              <TableHeaderRow cellComponent={cellHeaderComponent}/>
              <TableTreeColumn
                for={treeFor}
              />
                <TableFilterRow
                  showFilterSelector
                  cellComponent={FilterCell}
                  iconComponent={FilterIcon}
                />              
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

export default TreeGridBase;