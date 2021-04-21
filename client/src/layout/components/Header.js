import React from 'react';
import '../styles/header.scss';
import styled from 'styled-components';

const HeaderRight = styled.div`
    display:flex;
    jutify-content:space-between;
`
export default class Header extends React.Component {
    
    render() {
        return (
            <div className="library-system-header">
                <div className="library-system-header__left">
                    <div className="library-system-header__left__logo">Books</div>
                    <div className="library-system-header__left__navitems">
                        <div className="library-system-header__left__navitems__btn">
                            Admin
                        </div>
                    </div>
                </div>
                <div className="library-system-header__right">
                    <HeaderRight>
                        abc
                    </HeaderRight>
                </div>
            </div>
        )
    }
}

