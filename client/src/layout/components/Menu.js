import React from 'react';
import '../styles/menu.scss';
import MenuComponent from './menu/index';
import styled from 'styled-components';
const Logo = styled.div
`
height:54px;
display: flex;
justify-content: center;
align-items: center;
font-size:24px;
color: #5269fc;
border-bottom: 1px solid #ddd;
border-right: 1px solid #ddd;
`
const Menu = (props) =>{
    const {mode, isExpand} = props;
        return (
            <div style={{left: mode === 'mobile' ? isExpand ? 0: '-200px' : null }} className="menu-container">
                <Logo>Library M</Logo>
                <MenuComponent />
            </div>
        )
}

export default Menu;