import React from 'react';
import RoleGroupGrid from './components/RoleGroupGrid';
import Breadcrumbs from '../../components/breadcrumb/BreadCrumb';
import {withRouter} from 'react-router-dom';
import {Helmet} from 'react-helmet';

const RolePage = props=>{
    return (
        <div className="content-container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Role Page</title>
            </Helmet>
            <Breadcrumbs  keyPath={props.history.location.pathname} />
            <div className="content-container__title">
                Role
            </div>
            <RoleGroupGrid />
        </div>
    )
}

export default withRouter(RolePage);