import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  TreeDataState,
  CustomTreeData,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';
import axios from '../../axios/mainAxios';
import {buildTree} from '../../utils';
import get from 'lodash/get';

const getChildRows = (row, rootRows) => (row ? row.children : rootRows);

const cellHeaderComponent = (props)=>{
  return <TableHeaderRow.Cell {...props} style={{height:'10px'}}/>
}
class TreeGridBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns:[],
      data: [],
      tableColumnExtensions:[],
      treeFor:'',
      apiGet:''
    }
  }

  fetchData = ()=>{
    if(this.state.apiGet){
      axios.get(this.state.apiGet,{params:{page:1,page_size:1000}})
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
    const treeData = buildTree(data).children;
    this.setState({data:treeData});
  }

    render() {
      const {treeFor, data, columns, tableColumnExtensions} = this.state;
      return (
        <Paper>
          <Grid
            rows={data}
            columns={columns}
          >
            <TreeDataState defaultExpandedRowIds={[1]} />
            <CustomTreeData
              getChildRows={getChildRows}
            />
            <Table
              columnExtensions={tableColumnExtensions}
            />
            <TableHeaderRow cellComponent={cellHeaderComponent}/>
            <TableTreeColumn
              for={treeFor}
            />
          </Grid>
        </Paper>
      )
      
    }
}

export default TreeGridBase;