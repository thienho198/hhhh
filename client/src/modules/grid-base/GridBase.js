import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  CustomPaging,
  DataTypeProvider,
  IntegratedPaging
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import {Loading} from '../../components/loading/loading';
import axios from '../../axios/mainAxios';
import moment from 'moment';
import styled from 'styled-components';
import {ReactComponent as PlusIcon} from '../../components/button/icons/Plus.svg';
import Button from '../../components/button';


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


class GridBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            rows:[],
            totalCount:0,
            pageSize:10,
            currentPage:1,
            loading:false,
            apiGet:'',
            apiDelete:'',
            defaultColumnWidths:[]
        }
    }

  //#region side effects
  fetchData = ()=>{
      if(this.state.apiGet){
          this.setState({loading: true});
          axios.get(this.state.apiGet,{params:{page:this.state.currentPage, page_size:this.state.pageSize}})
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

    renderToolBar = ()=>{
      return (
              <Button onClick={this.onAddRow} styleButton={{backgroundColor:'#5269fc', color:'white'}} size="medium"  iconLeft={<PlusIcon width={15} height={15}/>}>Add New User</Button>
      ) 
    }

    render(){
        const {rows, columns, loading, currentPage, pageSize, totalCount, defaultColumnWidths} = this.state;
        return (
          <div>
            <Toolbar>
              {this.renderToolBar()}
            </Toolbar>
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
                <CustomPaging
                  totalCount={totalCount}
                />
                <IntegratedPaging />
                <DateTypeProvider
                  for={['createdAt','updatedAt']}
                />
                <Table noDataRowComponent={()=>loading ? <Loading/> : <div>No data</div>} />
                <TableColumnResizing minWidth={50} resizingMode="nextColumn" defaultColumnWidths={defaultColumnWidths}  />
                <TableHeaderRow />
                <PagingPanel 
                  pageSizes={[10,15,20]}
                />
              </Grid>
            </Paper>
          </div>
          );
    }
}


export default GridBase;