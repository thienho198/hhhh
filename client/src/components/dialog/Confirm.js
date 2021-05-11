import React from 'react';
import './style/confirm.scss';
import Button from '../button';

const ConfirmDialog = props=>{
    const {title='', content='', onOk} = props
    return (
        <div className="confirm-dialog">
            <div className="confirm-dialog__title">
                {title}
            </div>
            <div className="confirm-dialog__content">
                {content}
            </div>
            <div className="confirm-dialog__tool">
                <Button variant='outlined' onClick={props.onOk} styleButton={{marginRight:'10px'}}>Yes</Button>
                <Button variant='outlined' onClick={props.onClose}>No</Button>
            </div>
        </div>
    )
}

export default ConfirmDialog;