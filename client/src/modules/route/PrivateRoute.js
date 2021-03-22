import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

function PrivateRoute({ component, ...props }) {

    const renderCheckLoginLoading = ()=>{
      return (
        <div>Im checking login</div>
      )
    }
    const renderContent = ()=>{
      return props.isAuthenticated ? 
              React.createElement(component, props)
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
    checkLoginLoading: state.authentication.checkLoginLoading
  }
}

export default connect(mapStateToProps)(PrivateRoute);