import React from 'react';
import {renderRoutes} from 'react-router-config';
import Header from './components/Header';
import {ThemeProvider} from 'styled-components';
import {lightTheme,darkTheme} from '../config/theme';
import {GlobalStyles} from '../config/global';
import Menu from './components/Menu';

const RootLayout = ({ route }) => {
    return (
        <div style={{minHeight:'1200px'}}>
            <ThemeProvider theme={lightTheme}>
                <GlobalStyles />
                <Header /> 
                <Menu />
                <div style={{paddingTop:'54px', paddingLeft:'200px'}}>
                    {renderRoutes(route.routes)}
                </div>
            </ThemeProvider>
        </div>
    )
}

export default RootLayout;