import React, {useState,useEffect} from 'react';
import {renderRoutes} from 'react-router-config';
import Header from './components/Header';
import {ThemeProvider} from 'styled-components';
import {lightTheme,darkTheme} from '../config/theme';
import {GlobalStyles} from '../config/global';
import Menu from './components/Menu';
import useWindowDimensions from './hooks/useWindowDimension';
import styled from 'styled-components';
import './styles/root-layout.scss';

const OverlayExpandMenu = styled.div`
position: fixed;
left:0px;
top:0;
bottom:0;
right:0;
opacity:0,3;
z-index:301;
display: ${props=>props.isExpand ? 'block' : 'none'};
background-color: rgba(0,0,0,0.4); 
transition: all 0.3s;
`

const RootLayout = (props) =>{
    const [mode,setMode] = useState('normal'); // mobile
    const [isExpand, setIsExpand] = useState(false); 
    const {width, height} = useWindowDimensions();

    const onHandleToggleMenu = ()=>{
        if(mode === 'mobile'){
            setIsExpand(!isExpand);
        }
    }

    useEffect(() => {
        if(width<768){
            setMode('mobile');
        }
        else{
            setMode('normal');
            setIsExpand(false);
        }
    },[width, height])

        return (
            <div className="root-container">
                <ThemeProvider theme={lightTheme}>
                    <GlobalStyles />
                    <Header onToggleMenu={onHandleToggleMenu} /> 
                    <Menu isExpand={isExpand} mode={mode} />
                    <div className="root-container__content">
                        {renderRoutes(props.route.routes)}
                    </div>
                    <OverlayExpandMenu onClick={onHandleToggleMenu} isExpand={isExpand}/>
                </ThemeProvider>
            </div>
        )
}

export default RootLayout;