import React from 'react';
import Breadcrumbs from '../../components/breadcrumb/BreadCrumb';
import {withRouter} from 'react-router-dom';
import UserGrid from './components/UserGrid';

const UserPage = (props)=>{
    return (
        <div className="content-container">
            <Breadcrumbs  keyPath={props.history.location.pathname} />
            <div className="content-container__title">
                User
            </div>
            <UserGrid />
        </div>
    )
}

export default withRouter(UserPage);