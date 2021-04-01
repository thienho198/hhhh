import React from 'react';
import {renderRoutes} from 'react-router-config';
import Header from './components/Header';

const RootLayout = ({ route }) => {
    return (
        <div style={{minHeight:'1200px'}}>
            <Header />
            <div style={{paddingTop:'54px'}}>
                {renderRoutes(route.routes)}
            </div>
        </div>
    )
}

export default RootLayout;