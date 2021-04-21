import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';
import { Loading } from '../../pages/admin/theme-sources/material-ui/components/loading';
import styled from 'styled-components';
const LoadingCheckLogin = styled.div`
position:fixed;
top:0;
left:0;
right:0;
bottom:0;
background-color:white;
`
const AccessDenied = styled.div`
padding-top:100px;
`

function PrivateRoute({ component, roles , ...props }) {

    const renderCheckLoginLoading = ()=>{
      return (
        <LoadingCheckLogin><Loading /></LoadingCheckLogin>
      )
    }
    const renderAccessDenied = ()=>{
      return (
        <AccessDenied>Access denied</AccessDenied>
      )
    }
    const renderContent = ()=>{
      return props.isAuthenticated ? 
                  (
                    intersectionWith(props.accountData.type.roles,roles,isEqual).length > 0 ? 
                    React.createElement(component, props) : 
                    renderAccessDenied()
                 )
             : 
              <Redirect
                to={{
                  pathname: "/login"
                }}
              />   
    }
   
    return props.checkLoginLoading ? renderCheckLoginLoading() : renderContent()
}

const mapStateToProps = (state)=>{
  return {
    isAuthenticated: state.authentication.authenticated,
    checkLoginLoading: state.authentication.checkLoginLoading,
    accountData: state.authentication.accountData
  }
}

export default connect(mapStateToProps)(PrivateRoute);