import React from 'react';
import {withRouter} from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumb/BreadCrumb';
import MenuTreeGrid from './components/MenuTreeGrid';

const MenuPage = (props)=>{
    return (
        <div className="content-container">
            <Breadcrumbs  keyPath={props.history.location.pathname} />
            <div className="content-container__title">
                Menu
            </div>
            <MenuTreeGrid />
        </div>
    )
}

export default withRouter(MenuPage);