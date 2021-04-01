import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import intersectionWith from 'lodash/intersectionWith';
import isEqual from 'lodash/isEqual';

function PrivateRoute({ component, roles , ...props }) {

    const renderCheckLoginLoading = ()=>{
      return (
        <div>Im checking login</div>
      )
    }
    const renderNotFound = ()=>{
      console.log('page not found')
      return (
        <div>Not found this page</div>
      )
    }
    const renderContent = ()=>{
      return props.isAuthenticated ? 
                  (
                    intersectionWith(props.accountData.roles,roles,isEqual).length > 0 ? 
                    React.createElement(component, props) : 
                    renderNotFound()
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