import React from 'react'
import './style.css'
import classNames from 'classnames'
import {ReactComponent as CancelIcon} from './icons/CancelICon.svg'

class Modal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isShow: false, 
            content: null,
            parentMode: props.parentMode || false
        }
    }
    componentDidMount () {
      this.props.getRef && this.props.getRef(this)
    }
    componentDidUpdate(){
        // if(this.state.isShow){
        //     document.body.style.overflow = 'hidden';
        //     document.body.style.paddingRight = '17px';
        //     document.getElementById("navigationmain").style.paddingRight ='17px'
        //     if(document.getElementById("navigationfilter")){
        //         document.getElementById("navigationfilter").style.paddingRight ='17px'
        //     }

        // }
        // else{
        //     document.body.style.overflow = 'unset';
        //     document.body.style.paddingRight = '0';
        //     document.getElementById("navigationmain").style.paddingRight ='0'
        //     if(document.getElementById("navigationfilter")){
        //         document.getElementById("navigationfilter").style.paddingRight ='0'
        //     }
        // }
    }
    //#region events
    onShow = (content) => {
        this.setState({isShow:true, content: content})
    }
    onBlur = ()=>{
        this.setState({isShow: false, content: null})
    }
    render() {
        return (
            <div className={classNames('mymodal',{'mymodal--show': this.state.isShow, 'mymodal--parentmode': this.state.parentMode})} onClick={this.onBlur}>
                <div className="mymodal__content" onClick={(e)=>e.stopPropagation()}>
                    <div className="mymodal__closebtn" onClick={this.onBlur}><CancelIcon with={14} height={14}/></div>
                    {this.state.content}
                </div>
            </div>
        )
    }
}

export default Modal