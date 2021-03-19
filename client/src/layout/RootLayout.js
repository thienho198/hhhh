import React from 'react';
import {renderRoutes} from 'react-router-config';

const RootLayout = ({ route }) => {
    return (
        <div>
            <div>root layout</div>
            {renderRoutes(route.routes)}
        </div>
    )
}

export default RootLayout;