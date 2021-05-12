import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  CustomPaging,
  DataTypeProvider,
  IntegratedPaging,
  FilteringState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableFilterRow
} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../components/loading/loading';
import axios from '../../axios/mainAxios';
import moment from 'moment';
import styled from 'styled-components';
import {ReactComponent as PlusIcon} from '../../components/button/icons/Plus.svg';
import Button from '../../components/button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '../../components/mymodal';


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

const FilterCell = ({filteringEnabled, ...restProps})=>{
  // console.log('fsf', filteringEnabled)
  if(!filteringEnabled) return <div className="action-row"></div>;
  return <TableFilterRow.Cell {...restProps} />;
}

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
const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    editorComponent={FilterDate}
    {...props}
  />
);


class GridBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            rows:[],
            totalCount:0,
            pageSize:10,
            currentPage:0,
            loading:false,
            apiGet:'',
            apiDelete:'',
            tableColumnExtensions:[],
            pageName:'User',
            searchValue:'',
            dateColumns:['createdAt', 'updatedAt'],
            dateFilterOperations:['dateRange'],
            filters:[],
            defaultFilters:[],
            regexColumns:['email','phone','type'],
            dateRangeColumns:['createdAt', 'updatedAt'],
            arrayColumns:[],
            columnFilteringExtensions:[{columnName:'stt', filteringEnabled:false},{ columnName:'action', filteringEnabled:false}]
        }
    }

  //#region side effects
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
              //filter_array_regex
              else if(this.state.arrayColumns.indexOf(item.columnName)>=0){
                filterArray['filter_array_regex_'+item.columnName] = this.filterToRegexStr(item.operation, item.value);
              }
          })

          axios.get(this.state.apiGet, {params:{...params,...filtersRegex, ...filtersDateRange,...filterArray}})          
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
      this.setState({rows:res.data.data.map((row, index)=>{return{...row, stt:index+1}}),totalCount:res.data.data.length, loading:false});
  }

  componentDidMount(){
      this.fetchData()
  }

  //#region events
    setCurrentPage = (currentPage)=>{
        this.setState({currentPage:currentPage})
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
  onEditRow = (row) =>{

  }
  onAddRow = () =>{

  }
  onCloseModal = () =>{
    this.modalRef.onBlur()
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
        <Button onClick={this.onAddRow} styleButton={{backgroundColor:'#5269fc', color:'white', marginLeft:'20px'}} size="medium"  iconLeft={<PlusIcon width={15} height={15}/>}>Add New  {this.state.pageName}</Button>
    </StyledToolbar>
      ) 
    }

    render(){
        const {rows, columns, loading, currentPage, pageSize, totalCount, tableColumnExtensions, dateColumns,dateFilterOperations, filters, columnFilteringExtensions} = this.state;
        return (
          <div>
              {this.renderToolBar()}
            <Paper>
              <Grid
                rows={rows}
                columns={columns}
              >
                <PagingState
                  currentPage={currentPage}
                  onCurrentPageChange={this.setCurrentPage}
                  pageSize={pageSize}
                />
                 <FilteringState 
                 defaultFilters={[]} 
                 filters={filters} 
                 columnExtensions={columnFilteringExtensions}
                 onFiltersChange={this.onFiltersChange}
                 />
                <CustomPaging
                  totalCount={totalCount}
                />
                {/* <IntegratedPaging /> */}
                <DateTypeProvider
                  for={dateColumns}
                />
                <DataTypeProvider
                  for={dateColumns}
                  availableFilterOperations={dateFilterOperations}
                />
                <Table noDataRowComponent={()=>loading ? <Loading/> : <div>No data</div>} columnExtensions={tableColumnExtensions}/>
                <TableHeaderRow />
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
          );
    }
}


export default GridBase;