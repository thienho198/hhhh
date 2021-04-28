import React from 'react';
import '../styles/header.scss';
import styled from 'styled-components';
import {ReactComponent as MenuHamberger} from '../icons/MenuHambergerIcon.svg';

const HeaderRight = styled.div`
    display:flex;
    jutify-content:space-between;
`
const Header = (props)=> {
    const {onToggleMenu} = props;

        return (
            <div className="library-system-header">
                <div className="library-system-header__left">
                    <div className="library-system-header__left__logo" onClick={onToggleMenu}><MenuHamberger width={20} height={20}/></div>
                    <div className="library-system-header__left__navitems">
                        <div className="library-system-header__left__navitems__btn">
                        
                        </div>
                    </div>
                </div>
                <div className="library-system-header__right">
                    <HeaderRight>
                        
                    </HeaderRight>
                </div>
            </div>
        )
}

export default Header;
