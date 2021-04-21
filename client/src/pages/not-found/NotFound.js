import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
padding-top:300px;
text-align:center;
`

const NotFound = ()=>{
    return (
        <Container>
            Page Not Found!
        </Container>
    )
}

export default NotFound;