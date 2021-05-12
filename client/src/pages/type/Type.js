import React from 'react';
import Breadcrumbs from '../../components/breadcrumb/BreadCrumb';
import {withRouter} from 'react-router-dom';
import TypeGrid from './components/TypeGrid';

const TypePage = (props)=>{
    return (
        <div className="content-container">
            <Breadcrumbs  keyPath={props.history.location.pathname} />
            <div className="content-container__title">
                Type
            </div>
            <TypeGrid />
        </div>
    )
}

export default withRouter(TypePage);